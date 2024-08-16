
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

/** user-defined commands **/


export const commands = {
async startDualRecording(options: RecordingOptions) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("start_dual_recording", { options }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async stopAllRecordings() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("stop_all_recordings") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async enumerateAudioDevices() : Promise<string[]> {
    return await TAURI_INVOKE("enumerate_audio_devices");
},
async startServer() : Promise<Result<number, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("start_server") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openScreenCapturePreferences() : Promise<void> {
    await TAURI_INVOKE("open_screen_capture_preferences");
},
async openMicPreferences() : Promise<void> {
    await TAURI_INVOKE("open_mic_preferences");
},
async openCameraPreferences() : Promise<void> {
    await TAURI_INVOKE("open_camera_preferences");
},
async hasScreenCaptureAccess() : Promise<boolean> {
    return await TAURI_INVOKE("has_screen_capture_access");
},
async resetScreenPermissions() : Promise<void> {
    await TAURI_INVOKE("reset_screen_permissions");
},
async resetMicrophonePermissions() : Promise<void> {
    await TAURI_INVOKE("reset_microphone_permissions");
},
async resetCameraPermissions() : Promise<void> {
    await TAURI_INVOKE("reset_camera_permissions");
},
async closeWebview(label: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("close_webview", { label }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async makeWebviewTransparent(label: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("make_webview_transparent", { label }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getHealthCheckStatus() : Promise<boolean> {
    return await TAURI_INVOKE("get_health_check_status");
},
async getUploadSpeed() : Promise<number> {
    return await TAURI_INVOKE("get_upload_speed");
}
}

/** user-defined events **/



/** user-defined constants **/



/** user-defined types **/

export type RecordingOptions = { user_id: string; video_id: string; screen_index: string; video_index: string; audio_name: string; aws_region: string; aws_bucket: string }

/** tauri-specta globals **/

import {
	invoke as TAURI_INVOKE,
	Channel as TAURI_CHANNEL,
} from "@tauri-apps/api/core";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindow as __WebviewWindow__ } from "@tauri-apps/api/webviewWindow";

type __EventObj__<T> = {
	listen: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
	once: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
	emit: T extends null
		? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
		: (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

export type Result<T, E> =
	| { status: "ok"; data: T }
	| { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
	mappings: Record<keyof T, string>,
) {
	return new Proxy(
		{} as unknown as {
			[K in keyof T]: __EventObj__<T[K]> & {
				(handle: __WebviewWindow__): __EventObj__<T[K]>;
			};
		},
		{
			get: (_, event) => {
				const name = mappings[event as keyof T];

				return new Proxy((() => {}) as any, {
					apply: (_, __, [window]: [__WebviewWindow__]) => ({
						listen: (arg: any) => window.listen(name, arg),
						once: (arg: any) => window.once(name, arg),
						emit: (arg: any) => window.emit(name, arg),
					}),
					get: (_, command: keyof __EventObj__<any>) => {
						switch (command) {
							case "listen":
								return (arg: any) => TAURI_API_EVENT.listen(name, arg);
							case "once":
								return (arg: any) => TAURI_API_EVENT.once(name, arg);
							case "emit":
								return (arg: any) => TAURI_API_EVENT.emit(name, arg);
						}
					},
				});
			},
		},
	);
}
