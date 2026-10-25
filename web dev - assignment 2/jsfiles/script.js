/*  ============
    Booking page 
    ============*/

/* Gets movie and screening information */

var movieSelect = document.getElementById("movie");
var screeningDate = document.getElementById("screeningDate");
var screeningTime = document.getElementById("screeningTime");


if (movieSelect && screeningDate && screeningTime) {


/*  Extra block where clicking anywhere within
    "Screening Date" input field prompts the calendar */

    screeningDate.addEventListener("click", function() {
        if (screeningDate.showPicker) {
            screeningDate.showPicker();
        }
    });

    var movieSchedules = {
        "spider-man": ["1:30pm", "6:45pm"],
        "odyssey": ["4:30pm", "8:00pm"],
        "supermario": ["2:00pm", "5:30pm"],
        "lalaland": ["6:00pm"],
        "hailmary": ["2:30pm", "7:00pm"],
        "3idiots": ["3:30pm"]
    };


/*  Prefill movie selection from URL
    and read and update screening times of movie */

    var urlParameter = new URLSearchParams(window.location.search);
    var selectedMovie = urlParameter.get("movie");

    if (selectedMovie) {
        movieSelect.value = selectedMovie;
    }

    function updateScreeningTimes() {

        screeningTime.innerHTML = "";

        var defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select";
        screeningTime.appendChild(defaultOption);

        var movie = movieSelect.value;
        var date = screeningDate.value;

        if (movie === "" || date === "") {
            return;
        }

        var times = movieSchedules[movie];

        if (times) {
            for (var i = 0; i < times.length; i++) {

                var option = document.createElement("option");

                option.value = times[i];
                option.textContent = times[i];

                screeningTime.appendChild(option);
            }
        }
    }

    movieSelect.addEventListener("change", updateScreeningTimes);
    screeningDate.addEventListener("change", updateScreeningTimes);


/* Ticket price and total cost calulation */

var ticketQuantity = document.getElementById("ticketQuantity");
var ticketType = document.getElementById("ticketType");
var onePrice = document.getElementById("onePrice");
var totalCost = document.getElementById("totalCost");

/* Established pricing */
var moviePrices = {
    "spider-man": 18.00,
    "odyssey": 20.00,
    "supermario": 18.00,
    "lalaland": 14.00,
    "hailmary": 18.00,
    "3idiots": 14.00
};

/* Numerical operations in regards to ticket calculation */
function calculateTotal() {

    var movie = movieSelect.value;
    var quantity = Number(ticketQuantity.value);
    var type = ticketType.value;

    var price = moviePrices[movie];

    if (price === undefined) {
        onePrice.textContent = "$0.00";
        totalCost.textContent = "$0.00";
        return;
    }

    if (type === "child") {
        price = price * 0.80;
    }

    if (type === "student") {
        price = price * 0.90;
    }

    var total = price * quantity;

    onePrice.textContent = "$" + price.toFixed(2);
    totalCost.textContent = "$" + total.toFixed(2);
}

movieSelect.addEventListener("change", calculateTotal);
ticketQuantity.addEventListener("input", calculateTotal);
ticketType.addEventListener("change", calculateTotal);

calculateTotal();


/* Payment method fields are shown based off user's selected option */

var methodVoucher = document.getElementById("methodVoucher");
var methodOnline = document.getElementById("methodOnline");

var voucherFields = document.getElementById("voucherFields");
var cardFields = document.getElementById("cardFields");

function updatePaymentFields() {

    if (methodVoucher.checked) {

        voucherFields.hidden = false;
        cardFields.hidden = true;

    }
    else if (methodOnline.checked) {

        voucherFields.hidden = true;
        cardFields.hidden = false;

    }
    else {

        voucherFields.hidden = true;
        cardFields.hidden = true;
    }
}

methodVoucher.addEventListener("change", updatePaymentFields);
methodOnline.addEventListener("change", updatePaymentFields);

updatePaymentFields();


/* Copies customer email into billing email */

var customerEmail = document.getElementById("email");
var billingEmail = document.getElementById("billingEmail");
var sameEmail = document.getElementById("sameEmail");

sameEmail.addEventListener("change", function() {

    if (sameEmail.checked) {
        billingEmail.value = customerEmail.value;
    }

});

customerEmail.addEventListener("input", function() {

    if (sameEmail.checked) {
        billingEmail.value = customerEmail.value;
    }

});


/*  For booking validation.
    Written requirements for user inputs to compare to.
    Some elements are reused into here from the "Registration page" block at the very bottom   */

var bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener("submit", function(event) {

        var fullName = document.getElementById("fullName").value.trim();
        var email = document.getElementById("email").value.trim();
        var phone = document.getElementById("phone").value.trim();

        var errMsg = "";
        var result = true;

        var movie = movieSelect.value;
        var date = screeningDate.value;
        var time = screeningTime.value;
        var quantity = Number(ticketQuantity.value);

        if (fullName === "") {
            errMsg += "<p>Please enter your full name.</p>";
            result = false;
        }

        if (email === "") {
            errMsg += "<p>Please enter your email address.</p>";
            result = false;
        }
        else if (email.indexOf("@") === 0) {
            errMsg += "<p>Email address cannot start with an @ symbol.</p>";
            result = false;
        }
        else if (email.indexOf("@") < 0) {
            errMsg += "<p>Email address must contain an @ symbol.</p>";
            result = false;
        }

        if (phone === "") {
            errMsg += "<p>Please enter your phone number.</p>";
            result = false;
        }

        else if ((phone.length < 10) || (phone.match(/[^0-9]/) != null)) {
            errMsg += "<p>Phone number must contain at least 10 digits only.</p>";
            result = false;
        }

        if (movie === "") {
            errMsg += "<p>Please select a movie.</p>";
            result = false;
        }

        if (date === "") {
            errMsg += "<p>Please select a screening date.</p>";
            result = false;
        }

        if (time === "") {
            errMsg += "<p>Please select a screening time.</p>";
            result = false;
        }


/* checks if booking session is NOT in the past */

        if (date !== "" && time !== "") {
        var timeParts = time.match(/(\d+):(\d+)\s*(am|pm)/i);

    if (timeParts) {
        var hours = Number(timeParts[1]);
        var minutes = Number(timeParts[2]);
        var period = timeParts[3].toLowerCase();

        if (period === "pm" && hours !== 12) {
            hours = hours + 12;
        }

        if (period === "am" && hours === 12) {
            hours = 0;
        }

        var dateParts = date.split("-");

        var screeningDateTime = new Date(
            Number(dateParts[0]),
            Number(dateParts[1]) - 1,
            Number(dateParts[2]),
            hours,
            minutes
        );

        if (screeningDateTime <= new Date()) {
            errMsg += "<p>Please select a screening date and time in the future.</p>";
            result = false;
        }
    }
}


if (!Number.isInteger(quantity) || quantity < 1) {
    errMsg += "<p>Please select at least one ticket.</p>";
    result = false;
}

var methodVoucher = document.getElementById("methodVoucher");
var methodOnline = document.getElementById("methodOnline");

if (!methodVoucher.checked && !methodOnline.checked) {
    errMsg += "<p>Please select a payment method.</p>";
    result = false;
}

if (methodOnline.checked) {
    var cardType = document.getElementById("cardType").value;
    var cardNumber = document.getElementById("cardNumber").value.trim();

    if (cardType === "") {
        errMsg += "<p>Please select a card type.</p>";
        result = false;
    }

    var requiredDigits = 0;

    if (cardType === "visa" || cardType === "mastercard") {
        requiredDigits = 16;
    }
    else if (cardType === "amex") {
        requiredDigits = 15;
    }

    if (cardNumber === "") {
        errMsg += "<p>Please enter your card number.</p>";
        result = false;
    }
    else if (!/^\d+$/.test(cardNumber)) {
        errMsg += "<p>Card number must contain digits only.</p>";
        result = false;
    }
    else if (requiredDigits > 0 && cardNumber.length !== requiredDigits) {
        errMsg += "<p>The selected card type requires " +
                  requiredDigits + " digits.</p>";
        result = false;
    }
}

    if (errMsg !== "") {
        event.preventDefault();
        showErrorPanel(errMsg);
    } else {
        closeErrorPanel();Button
}

    });
}

}


/*  ===================
    Recommendation page 
    ===================*/

var recommendForm = document.getElementById("recommendForm");

if (recommendForm) {

    recommendForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var genre = document.getElementById("movieGenre").value;
        var age = document.getElementById("ageGroup").value;
        var occasion = document.getElementById("viewPreference").value;

        var movie = "";
        var movieID = "";

        if ((genre === "animation" || 
            genre === "adventure") && 
            age === "child" && 
            occasion !== "couple") {

            movie = "The Super Mario Galaxy Movie";
            movieID = "supermario";
        }

        else if ((genre === "action" ||
                 genre === "adventure") && 
                 occasion !== "solo") {

            movie = "Spider-Man: Brand New Day";
            movieID = "spider-man";
        }

        else if ((genre === "musical" ||
                 genre === "drama") && 
                 age !== "child") {

            movie = "La La Land";
            movieID = "lalaland";
        }

        else if (genre === "scienceFiction") {

            movie = "Project Hail Mary";
            movieID = "hailmary";
        }

        else if ((genre === "comedy" ||
                 genre === "drama") &&
                 age !== "child") {

            movie = "3 Idiots";
            movieID = "3idiots";
        }

        else if ((genre === "adventure" ||
                 genre === "fantasy") && 
                 age !== "child") {

            movie = "The Odyssey";
            movieID = "odyssey";
        }

        else if (genre === "action") {

            movie = "Spider-Man: Brand New Day";
            movieID = "spider-man";
        }

        else if (genre === "animation") {

            movie = "The Super Mario Galaxy Movie";
            movieID = "supermario";
        }

/* If no suitable movies match the user's preferences it returns no movie found */

        else {
            movie = "";
            movieID = "";
        }

        var result = document.getElementById("recommendationResult");

        if (result) {
            if (movie !== "") {

            result.innerHTML =
                '<div class="collection">' + 
                '<div class="movieCard">' +
                    '<img src="images/' + movieID + '.jpg" alt="' + movie + '">' +
                    '<h3>' + movie + '</h3>' + 
                    "<p>Based on your preferences, we think you'd enjoy this movie.</p>" +
                    '<a href="booking.html?movie=' + movieID +
                    '" class="panelButtonLite">Book Tickets</a>' +
                '</div>';
        }

        else {
            result.innerHTML = "<p>Sorry, we couldn't find a movie that matches your preferences. " +
            "Try changing one of your selections.</p>";
        }
        }
    });
}


/*  =================
    Registration page
    =================*/

function validate() {

    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var password = document.getElementById("password").value;
    var confirmPass = document.getElementById("confirmPass").value;
    var genM = document.getElementById("genM").checked;
    var genF = document.getElementById("genF").checked;
    var genOther = document.getElementById("genOther").checked;
    var genDisclosed = document.getElementById("genDisclosed").checked;
    var country = document.getElementById("country").value;

    /* Established variables */
    var errMsg = "";
    var result = true;
    var pattern = /^[A-Za-z0-9_]+$/;
    var specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;

    if (username === "") {
        errMsg += "<p>Please enter a username.</p>";
        result = false;
    }   

    else if (!username.match (pattern)) {
        errMsg += "<p>Username can only contain letters, numbers, or underscores.</p>";
        result = false;
    }

    else if (username.length < 5) {
        errMsg += "<p>Username must be at least 5 characters long.</p>";
        result = false;
    }

    if (email === "") {
        errMsg += "<p>Please enter your email address.</p>";
        result = false;
    }

    else if (email.indexOf('@') < 0) {
        errMsg += "<p>Email address must contain an @ symbol.</p>";
        result = false;
    }

    else if (email.indexOf('@') == 0) {
        errMsg += "<p>Email address cannot start with an @ symbol.</p>";
        result = false;
    }

    if (phone === "") {
        errMsg += "<p>Please enter your phone number.</p>";
        result = false;
    }

    else if ((phone.length < 8) || (phone.length > 15) || (phone.match (/[^0-9]/))) {
        errMsg += "<p>Phone number must contain 8-15 digits only.</p>";
        result = false;
    }

    if (password == "") {
        errMsg += "<p>Please enter a password.</p>";
        result = false;
    }

    else if (password.length < 10) {
        errMsg += "<p>Password must be at least 10 characters long.</p>";
        result = false;
    }

    else if ((password.match (/[A-Z]/) == null) || 
            (password.match (/[a-z]/) == null) || 
            (password.match (/[0-9]/) == null) || 
            (password.match (specialCharacters) == null)) {
                errMsg += "<p>Password must include one uppercase letter, lowercase letter, number, and special character.</p>";
                result = false;
            }

    if (confirmPass !== password) {
        errMsg += "<p>Confirmation password must match your password.</p>";
        result = false;
    }

    if ((genM == "") && (genF == "") && (genOther == "") && (genDisclosed == "")) {
        errMsg += "<p>A gender must be selected.</p>";
        result = false;
    }

    if (country == "") {
        errMsg += "<p>Please select a country/region.</p>"
        result = false;
    }

    if (errMsg !== "") {
        showErrorPanel(errMsg);
    } else {
        closeErrorPanel();
    }

    return result;
}

function showErrorPanel(errMsg) {

    var errorMessages = document.getElementById("errorMessages");
    var errorWindow = document.getElementById("errorWindow");
    var scrnOverlay = document.getElementById("scrnOverlay");

    errorMessages.innerHTML = errMsg;

    errorWindow.style.display = "block";
    scrnOverlay.style.display = "block";
}

function closeErrorPanel() {

    var errorWindow = document.getElementById("errorWindow");
    var scrnOverlay = document.getElementById("scrnOverlay");

    errorWindow.style.display = "none";
    scrnOverlay.style.display = "none";
}

var errorClose = document.getElementById("errorClose");

if (errorClose) {
    errorClose.addEventListener("click", closeErrorPanel);
}

function init() {
    var registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.onsubmit = validate;
    }
}

/* Executes the function "init" when the browser window is fully loaded */
window.onload = init;