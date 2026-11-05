// Older local previews forward to the current library server.
if(['127.0.0.1','localhost'].includes(location.hostname)&&['59151','59152','59153'].includes(location.port)){const target=new URL(location.href);target.port='59154';location.replace(target.href);}
