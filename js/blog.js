// Initialize collapsed state for all entries
document.querySelectorAll('.entry-full').forEach(text => {
    text.classList.add('collapsed');
});

// Expand/collapse blog entries
document.querySelectorAll('.expand-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const entry = this.closest('.blog-entry');
        const fullText = entry.querySelector('.entry-full');
        
        entry.classList.toggle('expanded');
        fullText.classList.toggle('collapsed');
        
        // Update button text
        if (entry.classList.contains('expanded')) {
            this.textContent = 'Show less';
        } else {
            this.textContent = 'Read more';
        }
    });
});