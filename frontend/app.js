// Use relative URLs for production (works with Docker), absolute for local dev
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

document.getElementById('formEntry').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_URL}/api/forms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Form submitted successfully!', 'success');
            document.getElementById('formEntry').reset();
            // Auto-reload history
            setTimeout(loadHistory, 1000);
        } else {
            showMessage('Error: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Error submitting form: ' + error.message, 'error');
    }
});

document.getElementById('loadHistory').addEventListener('click', loadHistory);

async function loadHistory() {
    const container = document.getElementById('historyContainer');
    container.innerHTML = '<p style="text-align: center;">Loading...</p>';

    try {
        const response = await fetch(`${API_URL}/api/forms`);
        const data = await response.json();

        if (data.length === 0) {
            container.innerHTML = '<div class="history-empty">No form submissions yet</div>';
        } else {
            container.innerHTML = data.map(form => `
                <div class="history-item">
                    <h3>${form.name}</h3>
                    <p><strong>Email:</strong> ${form.email}</p>
                    <p><strong>Phone:</strong> ${form.phone}</p>
                    <p><strong>Message:</strong> ${form.message}</p>
                    <p><strong>Submitted:</strong> ${new Date(form.created_at).toLocaleString()}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        container.innerHTML = `<div class="message error">Error loading history: ${error.message}</div>`;
    }
}

function showMessage(text, type) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    
    if (type === 'success') {
        successMsg.textContent = text;
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
    } else {
        errorMsg.textContent = text;
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
    }

    setTimeout(() => {
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
    }, 5000);
}

// Load history on page load
window.addEventListener('load', loadHistory);
