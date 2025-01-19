// Initialize EmailJS
emailjs.init('XksdfXF1MWa-d96mK');

const orderList = document.getElementById('order-list');
const totalPriceEl = document.getElementById('total-price');
const namee = document.getElementById('name');
const phone = document.getElementById('phone');
const table = document.getElementById('table');
const submitOrderBtn = document.getElementById('submit-order');

let order = [];

document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));

        order.push({ name, price });
        updateOrderSummary();
    });
});

document.querySelectorAll('.minus-btn').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));

        // Remove the item from the order
        order = order.filter(item => item.name !== name || item.price !== price);

        updateOrderSummary();
    });
});

function updateOrderSummary() {
    orderList.innerHTML = ''; // Clear the list
    let total = 0;

    // Only show order list if there are items
    if (order.length > 0) {
        orderList.classList.remove('hidden'); // Show the order list
        order.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center';
            
            // Item description
            const span = document.createElement('span');
            span.textContent = `${item.name} - ₹${item.price}`;
            li.appendChild(span);

            // Minus button
            const minusBtn = document.createElement('button');
            minusBtn.className = 'minus-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:bg-red-700 active:scale-95 transition transform mr-2';
            minusBtn.textContent = '-';
            minusBtn.addEventListener('click', () => {
                removeItemFromOrder(index);
            });
            li.appendChild(minusBtn);

            orderList.appendChild(li);
            total += item.price;
        });
    } else {
        orderList.classList.add('hidden'); // Hide the order list if no items
    }

    totalPriceEl.textContent = total;
}

// Function to remove an item from the order by index
function removeItemFromOrder(index) {
    order.splice(index, 1); // Remove item at the specified index
    updateOrderSummary(); // Update the summary
}

submitOrderBtn.addEventListener('click', () => {
    const namein = namee.value.trim();
    if (!namein) {
        alert('Please enter your Name.');
        return;
    }

    const phonein = phone.value.trim();
    if (!phonein) {
        alert('Please enter your Phone number.');
        return;
    }

    const tableno = table.value.trim();
    if (!tableno) {
        alert('Please enter your Table no.');
        return;
    }

    if (order.length === 0) {
        alert('Your order is empty.');
        return;
    }

    const orderDetails = {
        name: namein,
        phone: phonein,
        table: tableno,
        items: order.map(item => `${item.name} - ₹${item.price}`).join(', '),
        total: totalPriceEl.textContent
    };

    emailjs.send('service_1fg3w8h', 'template_botp94d', orderDetails)
        .then(() => {
            alert('Order sent successfully!');
            order = []; // Clear the order
            namee.value = ''; // Clear the name input
            phone.value = ''; // Clear the phone input
            table.value = ''; // Clear the table input
            updateOrderSummary(); // Update the order summary
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to send the order. Reason: ${error.text || 'Unknown error'}`);
        });
});

// Get references to the toggle button and the order summary container
const toggleButton = document.getElementById('toggle-summary');
const orderSummary = document.getElementById('order-summary');

// Add a click event listener to toggle visibility
toggleButton.addEventListener('click', () => {
    if (orderSummary.classList.contains('hidden')) {
        orderSummary.classList.remove('hidden'); // Show the order summary
        toggleButton.textContent = 'Hide Order Summary'; // Update button text
    } else {
        orderSummary.classList.add('hidden'); // Hide the order summary
        toggleButton.textContent = 'Show Order Summary'; // Update button text
    }
});