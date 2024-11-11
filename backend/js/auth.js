import { auth, signInWithEmailAndPassword } from './firebase.js';

// Get form elements
const signInForm = document.querySelector('.sign-in-container form');
const errorMessage = document.createElement('div');
errorMessage.style.color = 'red';
errorMessage.style.marginTop = '10px';
signInForm.appendChild(errorMessage);

signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Successful login
        console.log('Logged in successfully:', userCredential.user);
        window.location.href = '/frontend/login/hero.html';
        
    } catch (error) {
        // Handle errors
        console.error('Login error:', error);
        errorMessage.textContent = 'Invalid email or password. Please try again.';
    }
});