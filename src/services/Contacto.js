document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const messageDiv = document.getElementById('formMessage');
  
  // Mostrar estado de carga
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  messageDiv.style.display = 'none';

  try {
    const formData = new FormData(form);
    
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString()
    });

    const result = await response.json();

    if (response.ok) {
      // Éxito
      messageDiv.style.backgroundColor = '#d4edda';
      messageDiv.style.color = '#155724';
      messageDiv.textContent = '¡Mensaje enviado correctamente! Te contactaremos pronto.';
      form.reset();
    } else {
      // Error
      messageDiv.style.backgroundColor = '#f8d7da';
      messageDiv.style.color = '#721c24';
      messageDiv.textContent = result.error || 'Error al enviar el mensaje';
    }
  } catch (error) {
    messageDiv.style.backgroundColor = '#f8d7da';
    messageDiv.style.color = '#721c24';
    messageDiv.textContent = 'Error de conexión. Intenta nuevamente.';
  } finally {
    messageDiv.style.display = 'block';
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar';
  }
});