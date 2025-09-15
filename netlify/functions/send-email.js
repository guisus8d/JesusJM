const { Resend } = require('resend');

// Inicializar Resend con tu API key
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Solo permitir método POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    // Parsear los datos del formulario
    const params = new URLSearchParams(event.body);
    const formData = Object.fromEntries(params);

    const { 
      Numero: phone, 
      correo: email, 
      Motivo: subject = 'Sin motivo especificado' 
    } = formData;

    // Validar datos requeridos
    if (!phone || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' })
      };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Formato de email inválido' })
      };
    }

    // Validar formato de teléfono (solo números, 10 dígitos)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Teléfono debe tener 10 dígitos' })
      };
    }

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: 'JesusJM <onboarding@resend.dev>', // Cambia esto por tu dominio verificado
      to: ['jimenezmartinezjesus76.com'], // Email donde recibirás los mensajes
      subject: `Nuevo contacto: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f4f4f4; padding: 10px; border-radius: 5px; }
            .content { margin: 20px 0; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nuevo mensaje de contacto</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Teléfono:</span> ${phone}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="field">
                <span class="label">Motivo:</span> ${subject}
              </div>
              <div class="field">
                <span class="label">Fecha:</span> ${new Date().toLocaleString('es-ES')}
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Nuevo mensaje de contacto:
        Teléfono: ${phone}
        Email: ${email}
        Motivo: ${subject}
        Fecha: ${new Date().toLocaleString('es-ES')}
      `
    });

    if (error) {
      console.error('Error de Resend:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al enviar el email' })
      };
    }

    // Respuesta exitosa
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Mensaje enviado correctamente',
        data: data 
      })
    };

  } catch (error) {
    console.error('Error interno:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};