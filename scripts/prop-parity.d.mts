export interface PreactApi {
  data: string[];
  callbacks: string[];
  slots: string[];
}
export interface VueApi {
  data: string[];
  callbacks: string[];
  emits: string[];
}
export interface SvelteApi {
  data: string[];
  callbacks: string[];
  events: string[];
}
export function propsFromInterface(source: string, interfaceName: string, fileName?: string): PreactApi;
export function scriptOf(sfc: string): string;
export function vueApi(sfc: string): VueApi;
export function svelteApi(sfc: string): SvelteApi;
export function compare(preact: PreactApi, vue: VueApi, svelte: SvelteApi): { vue: string[]; svelte: string[] };
