class Canvas{
    constructor(){
        this.drawing = false;
        this.x = 0;
        this.y = 0;
        this.canvas = $('main > canvas')[0];
        this.context = this.canvas.getContext('2d');

        this.audio = new (window.AudioContext || window.webkitAudioContext)();
        this.gain = this.audio.createGain();
        this.gain.connect(this.audio.destination);

        this.freq = 440;
        this.line = 1;
        this.i = 1;
        this.j = 0.01;
        this.initDrawing();
    }

    initDrawing(){
        const self = this;
        this.context.strokeStyle = 'black'; 
        this.context.lineWidth = 1;
        this.canvas.addEventListener('mousedown', (e) =>{
            self.drawing = true;
            const position = getMousePos(self.canvas, e);
            self.x = position.x;
            self.y = position.y;
        });

        this.canvas.addEventListener('mousemove', (e) =>{
            if(self.drawing){
                const position = getMousePos(self.canvas, e);
                self.context.lineWidth = self.line;
                self.changeLine();
                self.context.beginPath();
                self.context.moveTo(self.x,self.y);
                self.context.lineTo(position.x,position.y);
                self.context.stroke();
                self.x = position.x;
                self.y = position.y;
                self.playSound();
            }
        });

        this.canvas.addEventListener('mouseup',() =>{
            self.drawing = false;
            self.freq = 440;
            self.line = 1;
        });

        function getMousePos(canvas, e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
              x: (e.clientX - rect.left)*scaleX,
              y: (e.clientY - rect.top)*scaleY
            };
          }
    }

    playSound(){
        this.gain.gain.value = 0.1;
        const oscilador = this.audio.createOscillator();
        oscilador.type = 'triangle';
        oscilador.frequency.setValueAtTime(this.freq, this.audio.currentTime);
        this.changeFreq();
        oscilador.connect(this.gain);
        oscilador.start();
        oscilador.stop(this.audio.currentTime + 0.1);
    }

    changeFreq(){
        this.freq += this.i;
    }

    changeLine(){
        this.line += this.j;
        if(this.line >= 2){
            this.i = -0.01;
        }
        if(this.freq <= 1){
            this.i = 0.01;
        }
    }

    copyCanvas(){
        if(navigator.clipboard){
            this.canvas.toBlob((blob) => {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                  alert("Copiado");
                }).catch(err => {
                  console.error('Error al copiar al portapapeles:', err);
                });
              }, 'image/png');
        }else{
            alert("Tu navegador no permite copiar con el portapapeles.");
        }
        
    }
    

    
}