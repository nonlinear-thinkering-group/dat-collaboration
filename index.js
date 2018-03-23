const Dat = require('dat-node');
const mirror = require('mirror-folder')
const readline = require('readline');
const fs = require('fs');

var framenames = ["firstframe", "secondframe"];

//readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(){
    rl.question('User a or b? (a/b):', (user) => {

        rl.question('Other dat key:', (key) => {
            if(user==="a"){
                HostFile(framenames[0]);
                if(key) TrackFile(framenames[1], key);
            } else {
                HostFile(framenames[1]);
                if(key) TrackFile(framenames[0], key);
            }
            ShowTransactions();
        });
    });
}

question();


function ShowTransactions(){
    var frames = framenames.map((n)=>{
        return JSON.parse(fs.readFileSync("./dats/"+n+"/transactions.json", "utf8"));
    });

    //display the chain
    //build the doubly linked list
    var transactions = [];
    var top = frames[0];

    function splicetransaction(t, frame){
        var oindex = transactions.findIndex((ot)=>{
            return ot.tid === t.root;
        });
        if(oindex !== undefined) transactions.splice(oindex+1, 0, t);
        if(oindex === undefined) transactions.unshift(t);
    }

    frames.map((frame)=>{
        frame.transactions.map((tr)=>{
            splicetransaction(tr, frame);
        });
    });

    console.log("=====");
    transactions.map((t)=>{
        console.log(t.value);
    });
    console.log("=====");

}

function HostFile(file){
    // 1. My files are in /joe/cat-pic-analysis
    Dat('./dats/'+file,function (err, dat) {
        if (err) throw err;

        dat.importFiles();

        // 3. Share the files on the network!
        dat.joinNetwork();
        // (And share the link)
        console.log('Hosting:',file,' on dat://', dat.key.toString('hex'));

        var progress = dat.importFiles({watch: true}) // with watch: true, there is no callback
        progress.on('put', function (src, dest) {
            console.log('Importing ', src.name, ' into archive')
            ShowTransactions();
        });

    });
}

function TrackFile(file, host){
    // 1. Tell Dat where to download the files
    Dat('./dat-download', {
      // 2. Tell Dat what link I want
      key: host,
      // (a 64 character hash from above)
    }, function (err, dat) {
      if (err) throw err;
      // 3. Join the network & download (files are automatically downloaded)
      dat.joinNetwork();

      dat.archive.metadata.update(download)

      function download () {
        var progress = mirror({fs: dat.archive, name: '/'}, './dat-download', function (err) {
          if (err) throw err
          console.log('Done');
        });
        progress.on('put', function (src) {
          console.log('Downloading', src.name);
          ShowTransactions();
      });
    }
    });
}
