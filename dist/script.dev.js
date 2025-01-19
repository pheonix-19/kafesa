"use strict";

// Initialize EmailJS
emailjs.init('qmcX9mFNQ2tQstuHk');
var orderList = document.getElementById('order-list');
var totalPriceEl = document.getElementById('total-price');
var namee = document.getElementById('name');
var phone = document.getElementById('phone');
var table = document.getElementById('table');
var submitOrderBtn = document.getElementById('submit-order');
var order = [];
document.querySelectorAll('.add-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    var name = button.getAttribute('data-name');
    var price = parseInt(button.getAttribute('data-price'));
    order.push({
      name: name,
      price: price
    });
    updateOrderSummary();
  });
});
document.querySelectorAll('.minus-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    var name = button.getAttribute('data-name');
    var price = parseInt(button.getAttribute('data-price')); // Remove the item from the order

    order = order.filter(function (item) {
      return item.name !== name || item.price !== price;
    });
    updateOrderSummary();
  });
});

function updateOrderSummary() {
  orderList.innerHTML = ''; // Clear the list

  var total = 0; // Only show order list if there are items

  if (order.length > 0) {
    orderList.classList.remove('hidden'); // Show the order list

    order.forEach(function (item, index) {
      var li = document.createElement('li');
      li.className = 'flex justify-between items-center'; // Item description

      var span = document.createElement('span');
      span.textContent = "".concat(item.name, " - \u20B9").concat(item.price);
      li.appendChild(span); // Minus button

      var minusBtn = document.createElement('button');
      minusBtn.className = 'minus-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:bg-red-700 active:scale-95 transition transform mr-2';
      minusBtn.textContent = '-';
      minusBtn.addEventListener('click', function () {
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
} // Function to remove an item from the order by index


function removeItemFromOrder(index) {
  order.splice(index, 1); // Remove item at the specified index

  updateOrderSummary(); // Update the summary
}

submitOrderBtn.addEventListener('click', function () {
  var namein = namee.value.trim();

  if (!namein) {
    alert('Please enter your Name.');
    return;
  }

  var phonein = phone.value.trim();

  if (!phonein) {
    alert('Please enter your Phone number.');
    return;
  }

  var tableno = table.value.trim();

  if (!tableno) {
    alert('Please enter your Table no.');
    return;
  }

  if (order.length === 0) {
    alert('Your order is empty.');
    return;
  }

  var orderDetails = {
    name: namee,
    phone: phone,
    table: table,
    items: order.map(function (item) {
      return "".concat(item.name, " - \u20B9").concat(item.price);
    }).join(', '),
    total: totalPriceEl.textContent
  };
  emailjs.send('service_ty2tkp8', 'template_toycr5q', orderDetails).then(function () {
    alert('Order sent successfully!');
    order = []; // Clear the order

    namee.value = ''; // Clear the name input

    phone.value = ''; // Clear the phone input

    table.value = ''; // Clear the table input

    updateOrderSummary(); // Update the order summary
  })["catch"](function (error) {
    console.error('Error:', error);
    alert("Failed to send the order. Reason: ".concat(error.text || 'Unknown error'));
  });
}); // Get references to the toggle button and the order summary container

var toggleButton = document.getElementById('toggle-summary');
var orderSummary = document.getElementById('order-summary'); // Add a click event listener to toggle visibility

toggleButton.addEventListener('click', function () {
  if (orderSummary.classList.contains('hidden')) {
    orderSummary.classList.remove('hidden'); // Show the order summary

    toggleButton.textContent = 'Hide Order Summary'; // Update button text
  } else {
    orderSummary.classList.add('hidden'); // Hide the order summary

    toggleButton.textContent = 'Show Order Summary'; // Update button text
  }
});