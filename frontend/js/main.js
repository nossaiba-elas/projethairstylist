 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: true
 });

// --- AUTH UTILS ---
function getToken() {
  return localStorage.getItem('token');
}
function setToken(token) {
  localStorage.setItem('token', token);
}
function removeToken() {
  localStorage.removeItem('token');
}
function decodeJWT(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
}

async function fetchDisponibilites() {
  try {
    // Always fetch fresh data from the server - no caching
    const slotsRes = await fetch(`${DISPONIBILITE_SERVICE}/disponibilites`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Accept': 'application/json'
      }
    });
    if (!slotsRes.ok) {
      throw new Error('Failed to fetch slots');
    }
    const slots = await slotsRes.json();
    return slots;
  } catch (err) {
    console.error('Error fetching slots:', err);
    throw err;
  }
}

function authHeaders() {
  return {
    'Authorization': 'Bearer ' + getToken(),
    'Content-Type': 'application/json',
  };
}

jQuery(document).ready(function($) {

	"use strict";

	

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();


	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	// siteSliderRange();


	var siteMagnificPopup = function() {
		$('.image-popup').magnificPopup({
	    type: 'image',
	    closeOnContentClick: true,
	    closeBtnInside: false,
	    fixedContentPos: true,
	    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
	     gallery: {
	      enabled: true,
	      navigateByImgClick: true,
	      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
	    },
	    image: {
	      verticalFit: true
	    },
	    zoom: {
	      enabled: true,
	      duration: 300 // don't foget to change the duration also in CSS
	    }
	  });

	  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
	    disableOn: 700,
	    type: 'iframe',
	    mainClass: 'mfp-fade',
	    removalDelay: 160,
	    preloader: false,

	    fixedContentPos: false
	  });
	};
	siteMagnificPopup();


	var siteCarousel = function () {
		if ( $('.nonloop-block-13').length > 0 ) {
			$('.nonloop-block-13').owlCarousel({
		    center: false,
		    items: 1,
		    loop: false,
				stagePadding: 0,
		    margin: 20,
		    nav: true,
				navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
		    responsive:{
	        600:{
	        	margin: 20,
	          items: 2
	        },
	        1000:{
	        	margin: 20,
	        	stagePadding: 0,
	          items: 2
	        },
	        1200:{
	        	margin: 20,
	        	stagePadding: 0,
	          items: 3
	        }
		    }
			});
		}

		$('.slide-one-item').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    autoplay: true,
	    pauseOnHover: false,
	    nav: true,
	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
	  });
	};
	siteCarousel();

	var siteStellar = function() {
		$(window).stellar({
	    responsive: false,
	    parallaxBackgrounds: true,
	    parallaxElements: true,
	    horizontalScrolling: false,
	    hideDistantElements: false,
	    scrollProperty: 'scroll'
	  });
	};
	siteStellar();

	var siteCountDown = function() {

		$('#date-countdown').countdown('2020/10/10', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
		    + '<span class="countdown-block"><span class="label">%d</span> days </span>'
		    + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
		    + '<span class="countdown-block"><span class="label">%M</span> min </span>'
		    + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
				
	};
	siteCountDown();

	var siteDatePicker = function() {

		if ( $('.datepicker').length > 0 ) {
			$('.datepicker').datepicker();
		}

	};
	siteDatePicker();

	// --- HAIR SALON RESERVATION APP LOGIC ---
	// Backend microservice URLs
	const USER_SERVICE = 'http://localhost:3000';
	const DISPONIBILITE_SERVICE = 'http://localhost:3001';
	const RESERVATION_SERVICE = 'http://localhost:3002';

	// --- AUTH LOGIC ---
	async function registerUser(name, email, password, role = 'client') {
	  const res = await fetch(`${USER_SERVICE}/auth/register`, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ name, email, password, role }),
	  });
	  
	  if (!res.ok) {
	    const error = await res.json().catch(() => ({}));
	    throw new Error(error.message || 'Registration failed');
	  }
	  return res.json();
	}

	async function loginUser(email, password) {
	  try {
	    const res = await fetch(`${USER_SERVICE}/auth/login`, {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({ email, password }),
	    });
	    if (!res.ok) {
	      const error = await res.json().catch(() => ({}));
	      throw new Error(error.message || 'Login failed');
	    }
	    const data = await res.json();
	    setToken(data.token);
	    updateAuthUI();
	    window.location.href = 'booking.html';
	  } catch (err) {
	    console.error('Login error:', err);
	    throw err;
	  }
	}

  // --- DISPONIBILITES LOGIC ---
	async function fetchDisponibilites() {
	  try {
	    // Always fetch fresh data from the server - no caching
	    const slotsRes = await fetch(`${DISPONIBILITE_SERVICE}/disponibilites`, {
	      method: 'GET',
	      headers: {
	        'Cache-Control': 'no-cache, no-store, must-revalidate',
	        'Pragma': 'no-cache',
	        'Expires': '0',
	        'Accept': 'application/json'
	      }
	    });
	    if (!slotsRes.ok) throw new Error('Failed to fetch slots');
	    const slots = await slotsRes.json();

	    // Then check active reservations if user is logged in
	    if (getToken()) {
	      const reservationsRes = await fetch(`${RESERVATION_SERVICE}/rendezvous`, {
	        headers: authHeaders(),
	        cache: 'no-store' // Ensures fresh data
	      });
	      if (reservationsRes.ok) {
	        const reservations = await reservationsRes.json();
	        
	        // Filter out slots that are either reserved or already booked by this user
	        return slots.filter(slot => {
	          const hasActiveReservation = reservations.some(res => 
	            res.disponibilite_id === slot.id && 
	            !res.is_cancelled
	          );
	          return !slot.is_reserved && !hasActiveReservation;
	        });
	      }
	    }

	    // For non-authenticated users, only return non-reserved slots
	    return slots.filter(slot => !slot.is_reserved);
	  } catch (err) {
	    console.error('Error fetching availabilities:', err);
	    throw new Error('Failed to fetch available slots');
	  }
	}

	// Make sure to load user reservations when page loads
	document.addEventListener('DOMContentLoaded', () => {
	  if (document.getElementById('userReservations')) {
	    loadUserReservations();
	  }
	});
	
	function renderDisponibilites(slots, container) {
	  container.innerHTML = '';
	  if (!slots.length) {
	    container.innerHTML = '<p>No available slots.</p>';
	    return;
	  }
	  const table = document.createElement('table');
	  table.className = 'table table-striped';
	  table.innerHTML = `<tr><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>`;
	  
	  // Sort slots by date and time
	  slots.sort((a, b) => {
	    const dateCompare = new Date(a.date) - new Date(b.date);
	    if (dateCompare !== 0) return dateCompare;
	    return a.heure.localeCompare(b.heure);
	  });
	  
	  slots.forEach(slot => {
	    const tr = document.createElement('tr');
	    const date = new Date(slot.date);
	    const formattedDate = date.toLocaleDateString();
	    const isoDate = date.toISOString().split('T')[0]; // For the data attribute
	    tr.innerHTML = `
	      <td>${formattedDate}</td>
	      <td>${slot.heure}</td>
	      <td><span class="badge badge-success">Available</span></td>
	      <td><button type="button" class="btn btn-primary btn-sm" data-id="${slot.id}" data-date="${isoDate}" data-heure="${slot.heure}">Book</button></td>
	    `;
	    table.appendChild(tr);
	  });
	  container.appendChild(table);
	}
	async function refreshUI() {
	  try {
	    // Show loading state
	    const container = document.getElementById('disponibilitesContainer');
	    const userReservationsContainer = document.getElementById('userReservations');
	    
	    if (container) {
	      container.innerHTML = '<p>Refreshing available slots...</p>';
	    }
	    if (userReservationsContainer) {
	      userReservationsContainer.innerHTML = '<p>Refreshing your appointments...</p>';
	    }

	    // Fetch fresh data in parallel
	    const [slots, _] = await Promise.all([
	      fetchDisponibilites(),
	      loadUserReservations() // This will update the userReservations container
	    ]);

	    // Update available slots
	    if (container) {
	      renderDisponibilites(slots, container);
	    }
	  } catch (err) {
	    console.error('Error refreshing UI:', err);
	    alert('Failed to refresh the page. Please try again.');
	  }
	}

	function loadBookingUI() {
	  const container = document.getElementById('disponibilitesContainer');
	  if (!container) return;
	  fetchDisponibilites().then(slots => {
	    renderDisponibilites(slots, container);
	    container.onclick = async e => {
	      if (e.target.tagName === 'BUTTON') {
	        e.preventDefault();
	        
	        // Get booking details
	        const button = e.target;
	        const slotId = button.getAttribute('data-id');
	        const date = button.getAttribute('data-date');
	        const heure = button.getAttribute('data-heure');
	        
	        // Check authentication
	        const token = getToken();
	        if (!token) {
	          alert('You must be logged in.');
	          return;
	        }
	        
	        // Get service details
	        const service = prompt('Enter service (e.g. Haircut):');
	        if (!service) return; // User cancelled service input
	        
	        try {
	          // Check if user already has this slot booked
	          const userReservations = await fetchUserReservations();
	          if (userReservations.some(r => r.disponibilite_id === Number(slotId) && !r.is_cancelled)) {
	            alert('You have already booked this slot.');
	            return;
	          }
	          
	          // Disable the button while booking
	          const button = e.target;
	          button.disabled = true;
	          button.textContent = 'Booking...';
	          
	          // Attempt booking
	          await bookRendezVous({ 
	            date, 
	            heure, 
	            service, 
	            disponibilite_id: Number(slotId) 
	          });
	          
	          alert('Booking successful!');
	          await refreshUI(); // Refresh available slots
	          await loadUserReservations(); // Refresh user's appointments
	        } catch (err) {
	          console.error('Booking error:', err);
	          button.disabled = false;
	          button.textContent = 'Book';
	          
	          // Determine the specific error case
	          if (err.message.includes('already reserved')) {
	            alert('Sorry, this time slot is already reserved. The page will refresh to show current availability.');
	          } else if (err.message.includes('not found')) {
	            alert('This slot is no longer available. The page will refresh to show current availability.');
	          } else {
	            alert('Booking failed: ' + err.message);
	          }
	          
	          // Always refresh to show current state
	          try {
	            await refreshUI();
	          } catch (refreshErr) {
	            console.error('Failed to refresh UI after booking error:', refreshErr);
	            alert('Please refresh the page manually to see the latest availability.');
	          }
	        }
	      }
	    };
	  });
	}
	async function bookRendezVous({ date, heure, service, disponibilite_id }) {
	  const token = getToken();
	  if (!token) throw new Error('Not authenticated');
	  
	  try {
	    // First check - verify slot is available by getting all slots
	    const checkRes = await fetch(`${DISPONIBILITE_SERVICE}/disponibilites`, {
	      method: 'GET',
	      headers: {
	        'Cache-Control': 'no-cache, no-store, must-revalidate',
	        'Pragma': 'no-cache',
	        'Expires': '0'
	      }
	    });
	    
	    if (!checkRes.ok) {
	      throw new Error('Failed to verify slot availability');
	    }
	    
	    const slots = await checkRes.json();
	    const slot = slots.find(s => s.id === disponibilite_id);
	    
	    if (!slot) {
	      throw new Error('Slot not found - it may have been removed');
	    }
	  
	    // Verify the slot exists and is not reserved
	    if (slot.is_reserved) {
	      throw new Error('This time slot has already been reserved by another client');
	    }
	    // Second check - attempt to make reservation, which will do another availability check
	    const res = await fetch(`${RESERVATION_SERVICE}/rendezvous`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json',
	        'Authorization': 'Bearer ' + token,
	        'Cache-Control': 'no-cache, no-store, must-revalidate',
	        'Pragma': 'no-cache'
	      },
	      body: JSON.stringify({ date, heure, service, disponibilite_id }),
	    });
	    
	    if (!res.ok) {
	      let errorMsg = res.statusText;
	      try {
	        const errJson = await res.json();
	        errorMsg = errJson.error || errorMsg;
	      } catch {}
	      throw new Error(errorMsg || 'Booking failed');
	    }
	    
	    const result = await res.json();
	    // Immediately refresh UI to show updated availability
	    await refreshUI();
	    return result;
	  } catch (err) {
	    console.error('Booking error:', err);
	    throw err;
	  }
	}

	async function fetchUserReservations() {
	  const token = getToken();
	  if (!token) return [];
	  const payload = decodeJWT(token);
	  // Note: This assumes your reservation_service has a way to get user reservations
	  // If not, you might need to implement this endpoint or filter client-side
	  try {
	    const res = await fetch(`${RESERVATION_SERVICE}/rendezvous`, {
	      headers: authHeaders()
	    });
	    if (!res.ok) return [];
	    const allReservations = await res.json();
	    // Filter reservations for current user
	    return allReservations.filter(r => r.utilisateur_id === payload.id && !r.is_cancelled);
	  } catch (err) {
	    console.error('Error fetching reservations:', err);
	    return [];
	  }
	}

	// Ajout : fonction pour récupérer l'utilisateur courant à jour
	async function fetchCurrentUser() {
	  const res = await fetch(`${USER_SERVICE}/auth/me`, {
	    headers: authHeaders()
	  });
	  if (!res.ok) return null;
	  return res.json();
	}

	// Nouvelle version asynchrone de renderUserReservations
	async function renderUserReservations(reservations, container) {
	  container.innerHTML = '';
	  if (!reservations.length) {
	    container.innerHTML = '<p>No appointments yet.</p>';
	    return;
	  }
	  const table = document.createElement('table');
	  table.className = 'table table-bordered';
	  table.innerHTML = `<tr><th>Date</th><th>Time</th><th>Service</th><th>Status</th><th>Action</th></tr>`;
	  // Récupérer le rôle utilisateur à jour via /auth/me
	  let userRole = null;
	  const currentUser = await fetchCurrentUser();
	  if (currentUser && currentUser.role) {
	    userRole = currentUser.role.toUpperCase();
	  }
	  reservations.forEach(r => {
	    const tr = document.createElement('tr');
	    const date = new Date(r.date).toLocaleDateString();
	    const status = r.is_cancelled ? '<span class="badge badge-danger">Cancelled</span>' : '<span class="badge badge-success">Active</span>';
	    let actionBtns = '';
	    if (!r.is_cancelled) {
	      if (userRole === 'ADMIN' || userRole === 'CLIENT') {
	        actionBtns += `<button class="btn btn-sm btn-warning mr-1" data-edit="${r.id}">Edit</button>`;
	      }
	      actionBtns += `<button class="btn btn-sm btn-danger" data-cancel="${r.id}">Cancel</button>`;
	    }
	    tr.innerHTML = `<td>${date}</td><td>${r.heure}</td><td>${r.service}</td><td>${status}</td>
	      <td>${actionBtns}</td>`;
	    table.appendChild(tr);
	  });
	  container.appendChild(table);
	}

	// Nouvelle version asynchrone de loadUserReservations
	async function loadUserReservations() {
	  const container = document.getElementById('userReservations');
	  if (!container) return;
	  const reservations = await fetchUserReservations();
	  await renderUserReservations(reservations, container);
	  container.onclick = async e => {
	    if (e.target.dataset.cancel) {
	      if (confirm('Are you sure you want to cancel this appointment?')) {
	        try {
	          await cancelRendezVous(e.target.dataset.cancel);
	          alert('Appointment cancelled successfully!');
	          loadUserReservations();
	        } catch (err) {
	          alert('Error cancelling appointment: ' + err.message);
	        }
	      }
	    }
	    if (e.target.dataset.edit) {
	      const id = e.target.dataset.edit;
	      // Trouver la ligne à éditer
	      const tr = e.target.closest('tr');
	      // Récupérer les valeurs actuelles
	      const tds = tr.querySelectorAll('td');
	      const oldDate = tds[0].innerText;
	      const oldHeure = tds[1].innerText;
	      const oldService = tds[2].innerText;
	      // Formulaire inline
	      tr.innerHTML = `
	        <td><input type="date" class="form-control form-control-sm" value="${formatDateForInput(oldDate)}"></td>
	        <td><input type="time" class="form-control form-control-sm" value="${oldHeure}"></td>
	        <td><input type="text" class="form-control form-control-sm" value="${oldService}"></td>
	        <td>${tds[3].innerHTML}</td>
	        <td>
	          <button class="btn btn-sm btn-success mr-1" data-validate-edit>Valider</button>
	          <button class="btn btn-sm btn-secondary" data-cancel-edit>Annuler</button>
	        </td>
	      `;
	      // Gestion des boutons
	      tr.querySelector('[data-cancel-edit]').onclick = () => {
	        loadUserReservations();
	      };
	      tr.querySelector('[data-validate-edit]').onclick = async () => {
	        const date = tr.querySelector('input[type="date"]').value;
	        const heure = tr.querySelector('input[type="time"]').value;
	        const service = tr.querySelector('input[type="text"]').value;
	        if (!date || !heure || !service) {
	          alert('Merci de remplir tous les champs');
	          return;
	        }
	        try {
	          await editRendezVous(id, { date, heure, service });
	          alert('Appointment updated successfully!');
	          loadUserReservations();
	        } catch (err) {
	          alert('Error updating appointment: ' + err.message);
	        }
	      };
	    }
	  };
	}

	async function editRendezVous(id, { date, heure, service }) {
	  const res = await fetch(`${RESERVATION_SERVICE}/rendezvous/${id}`, {
	    method: 'PUT',
	    headers: authHeaders(),
	    body: JSON.stringify({ date, heure, service }),
	  });
	  if (!res.ok) throw new Error('Edit failed');
	  return res.json();
	}

	async function cancelRendezVous(id) {
	  const res = await fetch(`${RESERVATION_SERVICE}/rendezvous/${id}`, {
	    method: 'DELETE',
	    headers: authHeaders(),
	  });
	  if (!res.ok) throw new Error('Cancel failed');
	  return res.json();
	}

	function formatDateForInput(dateStr) {
	  // dateStr est au format local (ex: 25/07/2025), on convertit en yyyy-mm-dd
	  const parts = dateStr.split('/');
	  if (parts.length === 3) {
	    // format fr
	    return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
	  }
	  // fallback
	  return dateStr;
	}

	// --- ADMIN FUNCTIONALITY ---
	async function addDisponibilite(date, heure) {
	  const res = await fetch(`${DISPONIBILITE_SERVICE}/disponibilites`, {
	    method: 'POST',
	    headers: authHeaders(),
	    body: JSON.stringify({ date, heure, is_reserved: false }),
	  });
	  if (!res.ok) throw new Error('Failed to add slot');
	  return res.json();
	}

	// --- ADMIN FORM HANDLER ---
	if (document.getElementById('addSlotForm')) {
	  document.getElementById('addSlotForm').onsubmit = async e => {
	    e.preventDefault();
	    const dateInput = document.getElementById('slotDate');
	    const heureInput = document.getElementById('slotHeure');
	    const messageDiv = document.getElementById('adminMessage');
	    messageDiv.style.display = 'none';
	    messageDiv.className = 'alert mt-3';
	    let date = dateInput.value;
	    let heure = heureInput.value;
	    
	    // Validation
	    if (!date || !heure) {
	      messageDiv.textContent = 'Please fill in all fields';
	      messageDiv.classList.add('alert-danger');
	      messageDiv.style.display = 'block';
	      return;
	    }

	    // Ensure date is formatted as YYYY-MM-DD
	    const d = new Date(date);
	    date = d.toISOString().slice(0, 10);

	    // Ensure time is valid
	    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(heure)) {
	      messageDiv.textContent = 'Please enter a valid time (HH:MM)';
	      messageDiv.classList.add('alert-danger');
	      messageDiv.style.display = 'block';
	      return;
	    }

	    const token = getToken();
	    const user = decodeJWT(token);

	    if (!token || !user || !user.role || user.role.toUpperCase() !== 'ADMIN') {
	      messageDiv.textContent = 'Admin access required';
	      messageDiv.classList.add('alert-danger');
	      messageDiv.style.display = 'block';
	      return;
	    }

	    try {
	      const res = await fetch(`${DISPONIBILITE_SERVICE}/disponibilites`, {
	        method: 'POST',
	        headers: {
	          'Content-Type': 'application/json',
	          'Authorization': 'Bearer ' + token,
	          'Cache-Control': 'no-cache'
	        },
	        body: JSON.stringify({ date, heure, is_reserved: false })
	      });
	      if (!res.ok) {
	        let errorMsg = res.statusText;
	        try {
	          const errJson = await res.json();
	          errorMsg = errJson.error || errorMsg;
	        } catch {}
	        messageDiv.textContent = errorMsg || 'Failed to add time slot';
	        messageDiv.classList.remove('alert-success');
	        messageDiv.classList.add('alert-danger');
	        messageDiv.style.display = 'block';
	        return;
	      }
	      messageDiv.textContent = 'Time slot added successfully!';
	      messageDiv.classList.remove('alert-danger');
	      messageDiv.classList.add('alert-success');
	      messageDiv.style.display = 'block';
	      document.getElementById('addSlotForm').reset();
	      
	      // Force immediate UI refresh with fresh data
	      const container = document.getElementById('disponibilitesContainer');
	      if (container) {
	        container.innerHTML = '<p>Refreshing available slots...</p>';
	        // Add a small delay to allow the backend to update
	        await new Promise(resolve => setTimeout(resolve, 1000));
	        const slots = await fetchDisponibilites();
	        renderDisponibilites(slots, container);
	      }
	    } catch (err) {
	      console.error(err);
	      messageDiv.textContent = err.message || 'Failed to add time slot';
	      messageDiv.classList.remove('alert-success');
	      messageDiv.classList.add('alert-danger');
	      messageDiv.style.display = 'block';
	    }
	  };
	}

	// Initialize booking UI when page loads
	document.addEventListener('DOMContentLoaded', () => {
	  if (document.getElementById('disponibilitesContainer')) {
	    loadBookingUI();
	  }
	});

	// Fix error handling for booking
	document.addEventListener('DOMContentLoaded', () => {
	  if (document.getElementById('disponibilitesContainer')) {
	    loadBookingUI().catch(err => {
	      console.error('Failed to load booking UI:', err);
	      alert('Error loading available slots. Please refresh the page.');
	    });
	  }
	});

	// --- UI HOOKUP (EXAMPLES) ---
	// Login/Register
	if (document.getElementById('loginForm')) {
	  document.getElementById('loginForm').onsubmit = async e => {
	    e.preventDefault();
	    const email = document.getElementById('loginEmail').value.trim();
	    const password = document.getElementById('loginPassword').value;
	    const errorDiv = document.getElementById('loginError');
	    
	    // Clear previous errors
	    errorDiv.style.display = 'none';
	    errorDiv.textContent = '';
	    
	    // Validation
	    if (!email || !password) {
	      errorDiv.textContent = 'Please fill in all fields';
	      errorDiv.style.display = 'block';
	      return;
	    }
	    
	    try {
	      await loginUser(email, password);
	      // Success - redirect will happen in loginUser function
	    } catch (err) {
	      errorDiv.textContent = err.message || 'Login failed. Please try again.';
	      errorDiv.style.display = 'block';
	    }
	  };
	}
	if (document.getElementById('registerForm')) {
	  document.getElementById('registerForm').onsubmit = async e => {
	    e.preventDefault();
	    const name = document.getElementById('registerName').value.trim();
	    const email = document.getElementById('registerEmail').value.trim();
	    const password = document.getElementById('registerPassword').value;
	    const errorDiv = document.getElementById('registerError');
	    
	    // Clear previous errors
	    errorDiv.style.display = 'none';
	    errorDiv.textContent = '';
	    
	    // Validation
	    if (!name || !email || !password) {
	      errorDiv.textContent = 'Please fill in all fields';
	      errorDiv.style.display = 'block';
	      return;
	    }
	    
	    if (password.length < 6) {
	      errorDiv.textContent = 'Password must be at least 6 characters long';
	      errorDiv.style.display = 'block';
	      return;
	    }
	    
	    try {
	      await registerUser(name, email, password, 'user');
	      errorDiv.textContent = 'Registration successful! Please log in.';
	      errorDiv.className = 'alert alert-success mt-3';
	      errorDiv.style.display = 'block';
	      document.getElementById('registerForm').reset();
	    } catch (err) {
	      errorDiv.textContent = err.message || 'Registration failed. Please try again.';
	      errorDiv.className = 'alert alert-danger mt-3';
	      errorDiv.style.display = 'block';
	    }
	  };
	}

	// Booking page logic
	if (document.getElementById('disponibilitesContainer')) {
	  loadBookingUI();
	}

	// Reservation management (edit/cancel) - Example usage
	async function showUserReservations(container) {
	  // You'd need a GET /rendezvous?user_id=... endpoint or filter client-side
	  // For now, this is a placeholder for how you might render and manage reservations
	}

	// Show/hide controls based on login
	if (document.getElementById('logoutBtn')) {
	  document.getElementById('logoutBtn').onclick = () => {
	    removeToken();
	    updateAuthUI();
	    // Don't redirect, just update the UI to show login/register forms
	  };
	}
	// Responsive: Use CSS media queries in your HTML/CSS for mobile/desktop layout

}); // End of jQuery document ready handler

// --- UI TOGGLE ---
function updateAuthUI() {
  const token = getToken();
  const user = decodeJWT(token);
  
  // Handle basic auth visibility
  document.querySelectorAll('.auth-only').forEach(el => el.style.display = token ? 'block' : 'none');
  document.querySelectorAll('.guest-only').forEach(el => el.style.display = token ? 'none' : 'block');
  
  // Handle admin sections
  const isAdmin = user && user.role && user.role.toUpperCase() === 'ADMIN';
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin ? 'block' : 'none';
  });
  
  // Show welcome message
  const welcomeNav = document.getElementById('welcomeNav');
  if (welcomeNav) {
    if (token && user && user.name) {
      welcomeNav.textContent = `Welcome, ${user.name}${isAdmin ? ' (Admin)' : ''}`;
      welcomeNav.style.display = 'block';
    } else {
      welcomeNav.style.display = 'none';
    }
  }
  
  // Load data if authenticated
  if (token) {
    try {
      loadBookingUI();
      loadUserReservations();
    } catch (err) {
      console.error('Error loading UI:', err);
    }
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', updateAuthUI);
window.addEventListener('storage', updateAuthUI);

// Handle page protection
function checkProtectedPage() {
  if (window.location.pathname.endsWith('booking.html') && !getToken()) {
    window.location.href = 'index.html';
  }
}
document.addEventListener('DOMContentLoaded', checkProtectedPage);