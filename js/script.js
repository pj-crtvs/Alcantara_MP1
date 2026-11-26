//to make sure na magload lahat ng element sa website bago magamit ang mga funtions
document.addEventListener('DOMContentLoaded', function() {
  setupCartDrawer();
  setupFlavorMoodTabs();
  setupProductHorizontalScroll();
  setupCustomerReviewForm();
});

//open close and add itemss sa carttttch
var cartItemsList = [];

function setupCartDrawer() {
  var cartButton = document.getElementById('iceboxCartTrigger');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartOverlay = document.getElementById('cartOverlay');
  var closeCartBtn = document.getElementById('closeCartButton');

  // Buksan ang cart pag clinick ang Icebox button
  if (cartButton && cartDrawer && cartOverlay) {
    cartButton.addEventListener('click', function(e) {
      e.preventDefault();
      cartDrawer.classList.add('open');
      cartOverlay.style.display = 'block';
    });
  }

  // closeeedtt ang cart
  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.style.display = 'none';
    }
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // find lahat ng add to cart button
  var addToCartButtons = document.querySelectorAll('.addToCartBigBtn');
  addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var itemName = button.getAttribute('data-name');
      var itemPrice = parseFloat(button.getAttribute('data-price'));
      var itemImg = button.getAttribute('data-img');

      addItemToCart(itemName, itemPrice, itemImg);

      // Buksan agad ang cart drawer para makita ni user
      if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('open');
        cartOverlay.style.display = 'block';
      }
    });
  });
}

// funtion to add item sa cartch natinn!
function addItemToCart(name, price, img) {
  // Check kung andoon na sa cart
  var foundItem = null;
  for (var i = 0; i < cartItemsList.length; i++) {
    if (cartItemsList[i].name === name) {
      foundItem = cartItemsList[i];
      break;
    }
  }

  if (foundItem) {
    foundItem.quantity += 1;
  } else {
    cartItemsList.push({
      name: name,
      price: price,
      img: img,
      quantity: 1
    });
  }

  renderCartItems();
}

// funtion to renderr the interface card ng mga items if added sa cart
function renderCartItems() {
  var cartContainer = document.getElementById('cartItemsContainer');
  var subtotalText = document.getElementById('cartSubtotalAmount');
  var cartBadge = document.getElementById('headerCartBadge');
  var shippingProgress = document.getElementById('freeShippingProgressBar');
  var shippingNotice = document.getElementById('freeShippingNoticeText');

  var total = 0;
  var totalCount = 0;

  for (var i = 0; i < cartItemsList.length; i++) {
    total += cartItemsList[i].price * cartItemsList[i].quantity;
    totalCount += cartItemsList[i].quantity;
  }

  // update badge count
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }

  // update subtotal
  if (subtotalText) {
    subtotalText.textContent = '₱' + total.toFixed(2);
  }

  // update free shipping progress bar
  if (shippingProgress && shippingNotice) {
    var freeShippingGoal = 999;
    var progressPercent = (total / freeShippingGoal) * 100;
    if (progressPercent > 100) progressPercent = 100;
    shippingProgress.style.width = progressPercent + '%';

    if (total >= freeShippingGoal) {
      shippingNotice.textContent = 'Free Nationwide Shipping Unlocked!';
    } else {
      var kulang = freeShippingGoal - total;
      shippingNotice.textContent = 'Add ₱' + kulang.toFixed(2) + ' more for FREE Nationwide Shipping!';
    }
  }

  if (!cartContainer) return;

  // if walang lamang yung cartt
  if (cartItemsList.length === 0) {
    cartContainer.innerHTML = '<p class="cartEmptyText">Your icebox is empty! Choose your favorite can.</p>';
    return;
  }

  // building the html card template
  var htmlContent = '';
  for (var j = 0; j < cartItemsList.length; j++) {
    var item = cartItemsList[j];
    htmlContent += '<div class="singleCartItemRow">' +
      '<img src="' + item.img + '" alt="' + item.name + '">' +
      '<div class="cartItemDetails">' +
        '<div class="cartItemTitleText">' + item.name + '</div>' +
        '<div class="cartItemPriceText">₱' + item.price.toFixed(2) + '</div>' +
      '</div>' +
      '<div class="quantityAdjustBtns">' +
        '<button onclick="changeItemQty(' + j + ', -1)">-</button>' +
        '<span>' + item.quantity + '</span>' +
        '<button onclick="changeItemQty(' + j + ', 1)">+</button>' +
      '</div>' +
    '</div>';
  }

  cartContainer.innerHTML = htmlContent;
}

// funtion pangdagdag or bawas ng quantity sa cart
function changeItemQty(index, amount) {
  if (cartItemsList[index]) {
    cartItemsList[index].quantity += amount;
    if (cartItemsList[index].quantity <= 0) {
      cartItemsList.splice(index, 1);
    }
    renderCartItems();
  }
}


//for the index.html if clinick ni use yung specific flavor na yun, magbabagorin yung content sa loob base sa flovor na inenter niya
function setupFlavorMoodTabs() {
  var tabButtons = document.querySelectorAll('.singleFlavorTabBtn');
  var canImage = document.getElementById('flavorTeaserCanImg');
  var flavorName = document.getElementById('flavorTeaserNameTitle');
  var moodTagline = document.getElementById('flavorTeaserMoodTagline');
  var tastingNotes = document.getElementById('flavorTeaserNotesText');
  var vibeBadge = document.getElementById('flavorTeaserVibeBadge');

  if (!tabButtons.length) return;

  // data ng tatlong flavor para kukunin nalang ng html dito yung assests and infoch
  var flavorData = {
    orange: {
      name: "Plamig Classic Orange",
      mood: "The Afternoon Merienda Kick",
      notes: "Bright, zesty, and unapologetically bold. Sun-ripened Philippine orange zest balanced with pure cane sugar sweetness. Crisp, nostalgic, and zero-fizz.",
      badge: "The Afternoon Merienda Kick",
      img: "assets/image/plamig_orange.png"
    },
    sagotgulaman: {
      name: "Plamig Sago't Gulaman",
      mood: "The Undisputed Street King",
      notes: "Deep caramelized muscovado arnibal loaded with bouncy grass jelly cubes and real chewy sago pearls. Pure kanto nostalgia sealed in an ice-cold can.",
      badge: "The Undisputed Street King",
      img: "assets/image/plamig_sagotgulaman.png"
    },
    ube: {
      name: "Plamig Creamy Ube",
      mood: "The Velvet Fiesta Treat",
      notes: "Smooth, velvety purple yam blended with a delicate hint of coconut milk richness. Liquid ube halaya made light, sweet, and refreshing for tropical heat.",
      badge: "The Velvet Fiesta Treat",
      img: "assets/image/plamig_ube.png"
    }
  };

  tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Tanggalin active class sa lahat
      tabButtons.forEach(function(btn) { btn.classList.remove('activeTab'); });
      button.classList.add('activeTab');

      var selectedFlavor = button.getAttribute('data-flavor');
      var data = flavorData[selectedFlavor];

      if (data) {
        if (canImage) canImage.src = data.img;
        if (flavorName) flavorName.textContent = data.name;
        if (moodTagline) moodTagline.textContent = data.mood;
        if (tastingNotes) tastingNotes.textContent = data.notes;
        if (vibeBadge) vibeBadge.textContent = data.badge;
      }
    });
  });
}


//horizontal scroll button (nagpahelp ako sa ai dito para maimplement pero i know kung papaaano sha guamgana po hehe)
function setupProductHorizontalScroll() {
  var scrollTrack = document.getElementById('productsScrollTrack');
  var prevBtn = document.getElementById('scrollLeftArrowBtn');
  var nextBtn = document.getElementById('scrollRightArrowBtn');
  var progressBar = document.getElementById('catalogProgressBar');

  if (!scrollTrack) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      scrollTrack.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      scrollTrack.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  // update progress bar habang nagsscroll
  if (progressBar) {
    scrollTrack.addEventListener('scroll', function() {
      var maxScroll = scrollTrack.scrollWidth - scrollTrack.clientWidth;
      if (maxScroll > 0) {
        var percentage = (scrollTrack.scrollLeft / maxScroll) * 100;
        progressBar.style.width = Math.max(15, percentage) + '%';
      }
    });
  }
}


// Reviews formm
function setupCustomerReviewForm() {
  var form = document.getElementById('customerReviewForm');
  var reviewsListContainer = document.getElementById('customerReviewsContainer');
  var starChoices = document.querySelectorAll('.singleStarPick');
  var starInput = document.getElementById('starRatingHiddenInput');

  // star selector itoo
  starChoices.forEach(function(star) {
    star.addEventListener('click', function() {
      var ratingValue = parseInt(star.getAttribute('data-star'));
      if (starInput) starInput.value = ratingValue;

      starChoices.forEach(function(s) {
        var sVal = parseInt(s.getAttribute('data-star'));
        if (sVal <= ratingValue) {
          s.classList.add('selectedStar');
        } else {
          s.classList.remove('selectedStar');
        }
      });
    });
  });

  // to handle yung form submit
  if (form && reviewsListContainer) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = document.getElementById('reviewAuthorName').value.trim();
      var flavor = document.getElementById('reviewSelectedFlavor').value;
      var rating = starInput ? parseInt(starInput.value) : 5;
      var comment = document.getElementById('reviewCommentText').value.trim();

      if (!name || !comment) {
        alert('Please fill out your name and review comment.');
        return;
      }

      // Gumawa ng new card
      var newCard = document.createElement('article');
      newCard.className = 'singleReviewItemCard';

      var starsText = '';
      for (var s = 0; s < rating; s++) starsText += '★';
      for (var em = rating; em < 5; em++) starsText += '☆';

      newCard.innerHTML = '<div class="reviewCardHeaderRow">' +
        '<div>' +
          '<div class="reviewerFullName">' + name + ' <span class="reviewerCityText">(Philippines)</span></div>' +
          '<span class="verifiedBuyerBadgeTag">✓ Verified Buyer: ' + flavor + '</span>' +
        '</div>' +
        '<div class="reviewStarsDisplay">' + starsText + '</div>' +
      '</div>' +
      '<p class="reviewTestimonialQuote">"' + comment + '"</p>';

      // Ipasok sa taas ng grid
      reviewsListContainer.insertBefore(newCard, reviewsListContainer.firstChild);

      // Reset form
      form.reset();
      var successBox = document.getElementById('reviewSuccessNotice');
      if (successBox) {
        successBox.style.display = 'block';
        setTimeout(function() { successBox.style.display = 'none'; }, 4000);
      }
    });
  }
}



// Contact form submission
function setupContactInquiryForm() {
  var contactForm = document.getElementById('siteInquiryForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var alertBox = document.getElementById('contactSentAlertNotice');
      contactForm.reset();
      if (alertBox) {
        alertBox.style.display = 'block';
        setTimeout(function() { alertBox.style.display = 'none'; }, 5000);
      }
    });
  }
}
