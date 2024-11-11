function createCompanyCircle(company, index) {
    const circle = document.createElement('div');
    circle.className = 'company-circle';
    
    // Calculate position
    const angle = (360 / 6) * index;
    const radius = 180;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    
    circle.style.transform = `translate(${x}px, ${y}px)`;
    
    const letter = document.createElement('div');
    letter.className = 'company-letter';
    letter.textContent = company.name[0].toUpperCase();
    
    circle.appendChild(letter);
    
    // Add click handler to show company details
    circle.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'company-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${company.name}</h3>
                <p>${company.description}</p>
                <button class="close-modal">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    });
    
    return circle;
}