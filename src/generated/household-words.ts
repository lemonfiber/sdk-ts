// Generated from the lemonfiber contract. Do not edit.
// What a member's surface may not show, as the contract publishes it.
// Regenerate with `npm run contract:generate`.

/** What a member's surface may not show. */
export interface HouseholdWords {
  /** Every service, engine and tunnel named, the bundle's parts with hyphens read as spaces. */
  readonly names: readonly string[];
  /** Every term for how the stack is built and run. */
  readonly terms: readonly string[];
  /** Every unit a size or a rate is written in. */
  readonly sizes: readonly string[];
  /** Every mark that shows an address or a rate wherever it is written. */
  readonly marks: readonly string[];
  /** Every name lemonfiber gives its own things, each with what it names, rendered in every locale as declared. */
  readonly declared: Readonly<Record<string, string>>;
  /** Texts a version, an address, a size or a rate makes unfit, each with what in it a member may not be shown. */
  readonly examples: readonly { readonly text: string; readonly names: string }[];
}

/** What a member's surface may not show, as the contract publishes it. */
export const HOUSEHOLD_WORDS: HouseholdWords = {
  names: ["apprise","audiobookshelf","bazarr","bindery","byparr","caddy","calibre","calibre web automated","configarr","dashy","docker","emby","flaresolverr","gluetun","gotify","homepage","jellyfin","jellyseerr","komga","lemonfiber","lidarr","medusa","navidrome","ntfy","nzbget","nzbhydra","nzbhydra2","overseerr","plex","podman","prowlarr","qbittorrent","radarr","readarr","recyclarr","sabnzbd","seerr","sickchill","sickgear","sonarr","tdarr","traefik","transmission","unpackerr","whisparr","wireguard"],
  terms: ["administrator","admin","api","backbone","bitrate","block account","byte","bytes","certificate","codec","compose","config","configuration","container","containers","curator","custom format","dashboard","database","disk","dns","download client","downloaded","downloader","downloading","endpoint","engine","error","gigabyte","grab","grabbed","hardlink","hdr","http","https","id","identifier","image","import","imported","indexer","indexers","ip","json","killswitch","log","logs","media server","megabyte","monitored","nzb","operator","peer","pem","pipeline","plugin","port","port forwarding","proxy","quality","quality profile","queue","queued","quick connect","ratio","remux","request service","retention","root folder","seed","seeding","server","servers","service","services","stack","stalled","storage","terabyte","token","torrent","tracker","transcode","transcoding","tunnel","upstream","url","usenet","vpn","webhook"],
  sizes: ["b","kb","mb","gb","tb","kib","mib","gib","tib","kbps","mbps","gbps"],
  marks: ["://","localhost","www.","/s","per second"],
  declared: {"form":"names a combination of profiles a stack declares, and an argument to the verbs that act on one","stack":"names the machine in every command, every path and every page of the documentation"},
  examples: [{"text":"It needs 4 GB more","names":"4"},{"text":"It needs 12GB more","names":"12gb"},{"text":"Fetching at 3 MB/s","names":"3"},{"text":"Fetching forty per second","names":"per second"},{"text":"Reached at 192.168.1.20","names":"192.168.1.20"},{"text":"Open it at localhost","names":"localhost"},{"text":"See www.house.example","names":"www."},{"text":"Open it at house://shelf","names":"://"},{"text":"Now on v1.4.2","names":"v1.4.2"}],
};
