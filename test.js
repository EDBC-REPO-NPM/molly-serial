const m = require('./main.js');

m( "/dev/ttyUSB0", 115200, (x)=>{

    setTimeout(()=>{
        console.log("done");
        process.exit(1);
    },  5000);
    
    while( !x.is_closed() ){
        console.log( x.read() );
        x.write("hola mundo\n");
    }

    console.log( x.is_closed() )

})