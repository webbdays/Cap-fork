use std::{
    backtrace::{Backtrace, BacktraceStatus},
    panic::PanicInfo,
    path::PathBuf,
    time::{Duration, SystemTime},
};
use tauri::{Context, Runtime};
use tracing_appender::rolling::{RollingFileAppender, Rotation};

#[macro_use]
pub mod commands;
pub mod config;

pub fn panic_hook(info: &PanicInfo) {
    tracing::error!("Thread panicked: {:?}", info);
    // If the panic has a source location, record it as structured fields.
    if let Some(location) = info.location() {
        let backtrace = Backtrace::capture();
        tracing::error!(
            panic.file = format!("{}:{}", location.file(), location.line()),
            panic.column = location.column(),
            message = %info,
        );
        if backtrace.status() == BacktraceStatus::Captured {
            tracing::error!(backtrace = %backtrace);
        }
    } else {
        tracing::error!(message = %info);
    }
}

pub fn get_log_file<R: Runtime>(context: &Context<R>) -> RollingFileAppender {
    // https://github.com/tauri-apps/tauri/discussions/7757#discussioncomment-6929192
    let identifier = context.config().identifier.clone();
    let log_directory = app_log_dir(identifier).unwrap_or_else(|_| {
        println!("Using current directory as log directory");
        PathBuf::new().join("logs")
    });

    if let Ok(old_logs) = std::fs::read_dir(&log_directory) {
        // Only keep logs around for a week.
        // You can dodge this removal by moving logs you want to keep to a subdirectory.
        let age_limit = SystemTime::now() - Duration::from_secs(7 * 86_400);

        println!(
            "Deleting logs older than a week from {}",
            log_directory.display()
        );

        for log in old_logs
            .filter_map(|entry_result| entry_result.ok())
            .filter(|entry| {
                entry.metadata().is_ok_and(|metadata| {
                    metadata.is_file() && metadata.modified().is_ok_and(|time| time < age_limit)
                })
            })
        {
            let _ = std::fs::remove_file(log.path());
        }
    }

    RollingFileAppender::builder()
        .rotation(Rotation::DAILY)
        .filename_prefix("cap_debug")
        .filename_suffix("log")
        .build(log_directory)
        .unwrap()
}

pub fn app_log_dir(identifier: String) -> tauri::Result<PathBuf> {
    #[cfg(target_os = "macos")]
    let path = dirs::home_dir()
        .ok_or(tauri::Error::UnknownPath)
        .map(|dir| dir.join("Library/Logs").join(identifier));

    #[cfg(not(target_os = "macos"))]
    let path = dirs::data_local_dir()
        .ok_or(tauri::Error::UnknownPath)
        .map(|dir| dir.join(identifier).join("logs"));

    path
}
