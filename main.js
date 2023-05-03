const cp = require('child_process');
const {Buffer} = require('buffer');
const rl = require('readline');
const os = require('os');
const fs = require('fs');

set_baud_rate = ( path, baud )=>{
    if( (/window/i).test(os.platform()) )
         cp.execSync(`MODE ${path}:${baud}`);
    else cp.execSync(`stty -F ${path} ${baud}`);
}

module.exports = ( path, baud, callback ) => {
    if( baud > 0 ) set_baud_rate( path, baud );
    fs.open( path, 'r+', (err,fd)=>{
        if( err ) throw new Error("such file or directory does not exist");
        let closed = false; callback({
            write: ( data )=>{ fs.writeSync(fd,data) },
            is_closed: ()=>{ return closed },
            close: ()=>{ fs.close(fd) },
            read: ()=>{ 
                const buff = new Array(); const b = Buffer.alloc(1);
                while(!closed){ fs.readSync( fd, b );
                    if( b[0] <= 0 ){ closed = true; break; }
                    if( b[0] != 10 ) buff.push(b.toString());
                    else break; b.fill('\0');
                }   return buff.join('');
            },
        });      
    });
};