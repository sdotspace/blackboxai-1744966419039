class Flashcards {
    constructor() {
        this.cards = JSON.parse(localStorage.getItem('flashcards')) || [];
        this.currentCardIndex = 0;
        this.categories = new Set();
        this.init();
    }

    init() {
        // Initialize categories
        this.updateCategories();
        
        // Set up event listeners
        document.getElementById('currentCard').addEventListener('click', () => this.flipCard());
        document.getElementById('prevCard').addEventListener('click', () => this.prevCard());
        document.getElementById('nextCard').addEventListener('click', () => this.nextCard());
        document.getElementById('randomCard').addEventListener('click', () => this.randomCard());
        document.getElementById('newCard').addEventListener('click', () => this.openCardForm());
        document.getElementById('saveCard').addEventListener('click', () => this.saveCard());
        document.getElementById('cancelCard').addEventListener('click', () => this.closeCardForm());
        document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterCards(e.target.value));
        
        // Set up difficulty stars
        document.querySelectorAll('#difficultyStars i').forEach(star => {
            star.addEventListener('click', () => this.rateCard(parseInt(star.dataset.rating)));
        });

        // Display first card or empty state
        if (this.cards.length > 0) {
            this.showCard(this.currentCardIndex);
        } else {
            this.showEmptyState();
        }
    }

    updateCategories() {
        this.categories = new Set(this.cards.map(card => card.category));
        const categoryFilter = document.getElementById('categoryFilter');
        
        // Save current selection
        const currentValue = categoryFilter.value;
        
        // Clear and rebuild options
        categoryFilter.innerHTML = '';
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Categories';
        categoryFilter.appendChild(allOption);
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Restore selection if possible
        if (currentValue && [...this.categories].includes(currentValue)) {
            categoryFilter.value = currentValue;
        }
    }

    showCard(index) {
        if (index < 0 || index >= this.cards.length) return;
        
        this.currentCardIndex = index;
        const card = this.cards[index];
        
        document.getElementById('cardFront').textContent = card.front;
        document.getElementById('cardBack').textContent = card.back;
        document.getElementById('cardCount').textContent = `${index + 1}/${this.cards.length}`;
        
        // Reset card to front view
        document.getElementById('currentCard').classList.remove('flipped');
        
        // Update difficulty stars
        this.updateDifficultyStars(card.difficulty || 0);
    }

    showEmptyState() {
        document.getElementById('cardFront').textContent = 'No flashcards yet';
        document.getElementById('cardBack').textContent = 'Click "New Card" to create your first flashcard';
        document.getElementById('cardCount').textContent = '0/0 cards';
        document.getElementById('currentCard').classList.remove('flipped');
    }

    flipCard() {
        document.getElementById('currentCard').classList.toggle('flipped');
    }

    prevCard() {
        if (this.cards.length === 0) return;
        let newIndex = this.currentCardIndex - 1;
        if (newIndex < 0) newIndex = this.cards.length - 1;
        this.showCard(newIndex);
    }

    nextCard() {
        if (this.cards.length === 0) return;
        let newIndex = this.currentCardIndex + 1;
        if (newIndex >= this.cards.length) newIndex = 0;
        this.showCard(newIndex);
    }

    randomCard() {
        if (this.cards.length === 0) return;
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        this.showCard(randomIndex);
    }

    updateDifficultyStars(rating) {
        const stars = document.querySelectorAll('#difficultyStars i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    rateCard(rating) {
        if (this.cards.length === 0) return;
        this.cards[this.currentCardIndex].difficulty = rating;
        this.saveCards();
        this.updateDifficultyStars(rating);
    }

    openCardForm() {
        document.getElementById('cardFormModal').classList.remove('hidden');
        document.getElementById('cardFormModal').classList.add('flex');
        document.getElementById('cardFrontInput').value = '';
        document.getElementById('cardBackInput').value = '';
        document.getElementById('cardCategory').value = '';
    }

    closeCardForm() {
        document.getElementById('cardFormModal').classList.add('hidden');
        document.getElementById('cardFormModal').classList.remove('flex');
    }

    saveCard() {
        const front = document.getElementById('cardFrontInput').value.trim();
        const back = document.getElementById('cardBackInput').value.trim();
        const category = document.getElementById('cardCategory').value.trim() || 'General';
        
        if (!front || !back) {
            alert('Please fill in both front and back of the card');
            return;
        }
        
        this.cards.push({
            id: Date.now(),
            front,
            back,
            category,
            difficulty: 0,
            createdAt: new Date().toISOString()
        });
        
        this.saveCards();
        this.updateCategories();
        this.showCard(this.cards.length - 1);
        this.closeCardForm();
    }

    filterCards(category) {
        if (category === 'all') {
            this.showCard(0);
            return;
        }
        
        const filteredCards = this.cards.filter(card => card.category === category);
        if (filteredCards.length > 0) {
            this.currentCardIndex = 0;
            this.showCard(0);
        } else {
            this.showEmptyState();
        }
    }

    saveCards() {
        localStorage.setItem('flashcards', JSON.stringify(this.cards));
    }
}

// Initialize the flashcards when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Flashcards();
});