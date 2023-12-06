class Memoria {
    elements = {
        HTML5: [
            { element: "HTML5", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg" },
            { element: "HTML5", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg" }
        ],
        CSS3: [
            { element: "CSS3", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" },
            { element: "CSS3", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" }
        ],
        JS: [
            { element: "JS", source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg" },
            { element: "JS", source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg" }
        ],
        PHP: [
            { element: "PHP", source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg" },
            { element: "PHP", source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg" }
        ],
        SVG: [
            { element: "SVG", source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg" },
            { element: "SVG", source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg" }
        ],
        W3C: [
            { element: "W3C", source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg" },
            { element: "W3C", source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg" }
        ]
    };

    constructor(){
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secordCard = null;
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements() {
        const elementsArray = Object.values(this.elements).flat();
        for (let i = elementsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [elementsArray[i], elementsArray[j]] = [elementsArray[j], elementsArray[i]];
        }
        Object.keys(this.elements).forEach((key, index) => {
            this.elements[key] = [elementsArray[index * 2], elementsArray[index * 2 + 1]];
        });
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        const isMatch = this.firstCard.dataset.element === this.secondCard.dataset.element;
        isMatch ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        console.log('Las cartas son iguales');
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard();
    }

    unflipCards(){
        setTimeout(() => {
            console.log('Las cartas no son iguales');
            this.firstCard.dataset.state = ' ';
            this.secondCard.dataset.state = ' ';
            this.firstCard.classList.remove('flip');
            this.secondCard.classList.remove('flip');
            this.resetBoard();
          }, 500);
    }

    createElements() {
        const section = document.querySelector('body > section'); // Ajusta el selector según la estructura de tu HTML

        // Recorrer el objeto JSON y crear nodos article para cada tarjeta
        for (const key in this.elements) {
            const elementArray = this.elements[key];

            elementArray.forEach((card) => {
                const article = document.createElement('article');
                article.dataset.element = card.element;

                // Añadir encabezado h3 para tarjeta bocarriba
                const h3 = document.createElement('h3');
                h3.textContent = 'Tarjeta de memoria';
                article.appendChild(h3);

                // Añadir imagen para tarjeta volteada
                const img = document.createElement('img');
                img.src = card.source;
                img.alt = card.element;
                article.appendChild(img);

                // Añadir tarjeta al documento HTML
                section.appendChild(article);
            });
        }

    }

    addEventListeners() {
        const cards = document.querySelectorAll('body > section > article');
        
        cards.forEach((card) => {
          card.addEventListener('click', this.flipCard.bind(this, card));
          
        });
    }

    flipCard(card){
        if(card.dataset.state === 'revealed'){
            return;
        }
        if(this.lockBoard){
            return;
        }
        if(this.firstCard === card){
            return;
        }

        card.dataset.state = 'flip';
        card.classList.add('flip');
        if(!this.hasFlippedCard){
            this.hasFlippedCard = true;
            this.firstCard = card;
            
        }else{
            this.secondCard = card
            this.checkForMatch();
        }

        const textoH3 = card.querySelector('img').alt;
        console.log(textoH3);
    }

}