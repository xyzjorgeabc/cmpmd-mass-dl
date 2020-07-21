const ytdl = require('youtube-dl');
ytdl.setYtdlBinary('/usr/bin/youtube-dl');
const fs = require('fs');

let show_episodes = [];
let last_ep = 0;
main ();
async function main () {
  if (!show_episodes.length) {
    show_episodes = get_episodes_metadata();
  }

  const ep_metadata = show_episodes[last_ep];
  if (last_ep >= show_episodes.length) return; 
  
  console.log(ep_metadata.name + "  ", "\n");
  console.log(ep_metadata.video_url);

  if (!fs.existsSync("/mymedia/internet/the_gavin_macinnes_show/" + ep_metadata.name + ".mp4") ) {
    await dl_ep(ep_metadata);
  }
  else {
    last_ep++;
    return main();
  }

}

function get_episodes_metadata() {
  /*
   * Metadata from https://api-ott.compoundmedia.com/getreferencedobjects?device_type=desktop&max=450&order=new_first&parent_id=97&parent_meta=0&parent_type=show&partner=internal&platform=web
   * This url is used to display the episodes list on the website.
   * deleted - modified some query params to get all the episodes and not calculate the sign param.
   * the file contains the streaming file(m3u8) url's that do not require authentication or subscription
   * You can try this with other shows by modifying the url's param "parent_id" with other show id and the "max" param with the amount of episodes the show has.
   * 
   */

  const ep_metadata = JSON.parse(fs.readFileSync("./metadata.json", {encoding: "utf-8"}));
  return ep_metadata.objects;
}

async function dl_ep (ep_metadata) {

  const path = "/mymedia/internet/the_gavin_macinnes_show/" + ep_metadata.name + '.mp4';

  if (fs.existsSync(path)) return main();

  ytdl.exec(ep_metadata.video_url, ['--hls-prefer-native', '-o', path], "", function(err, output){
    if (!err)last_ep++;
    main();
  });
}

