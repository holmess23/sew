class Noticias{
    constructor() {
        this.fileAPIsupported = window.File && window.FileReader && window.FileList && window.Blob;
      }

      readInputFile(fileInput) {
        if (!this.fileAPIsupported) {
          console.log('Tu navegador no soporta la API File.');
          return;
        }
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
          const contents = event.target.result;
          const noticias = contents.split("\n");
          for(let i = 0; i < noticias.length; i++){
            const partes = noticias[i].split("_");
            const $article = $('<article></article>');
            const $h3 = $('<h3></h3>').text(partes[0]).appendTo($article);
            const $p1 = $('<p></p>').text(partes[1]).appendTo($article);
            const $p2 = $('<p></p>').text(partes[2]).appendTo($article);
            const $autor = $('<p></p>').text(partes[3]).appendTo($article);
            $article.appendTo('main > section');
        }
        };

        

        reader.readAsText(file);
      }

      addNew(){
        const campos = [];
        $('input[type="text"]').each(function() {
            campos.push($(this).val());
        });
        const $article = $('<article></article>');
        const $h3 = $('<h3></h3>').text(campos[0]).appendTo($article);
        const $p1 = $('<p></p>').text(campos[1]).appendTo($article);
        const $p2 = $('<p></p>').text(campos[2]).appendTo($article);
        const $autor = $('<p></p>').text(campos[3]).appendTo($article);
        $article.appendTo('main > section');
      }
    
}