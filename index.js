// Shared UI helpers for the top navigation.

// Highlight the active tab by its label text.
const setActiveNav = (label) => {
    $('.navbar-nav .nav-link').removeClass('active');
    $('.navbar-nav .nav-link').each(function () {
        if ($(this).text().trim() === label) {
            $(this).addClass('active');
        }
    });
};

const showAbout = () => {
    setActiveNav('About');
    $('#container').html(`
        <div class="about-box">
            <h3>About Cryptonite</h3>
            <p>
                Cryptonite is a live market tracker for both <strong>cryptocurrencies</strong>
                and <strong>stocks</strong>.
            </p>
            <ul>
                <li><strong>Crypto</strong> — browse coins, pick up to 5 favourites and view more info (USD/EUR prices).</li>
                <li><strong>Stocks</strong> — live quotes for popular companies with daily change.</li>
                <li><strong>Live reports</strong> — a real-time chart of your selected coins.</li>
            </ul>
            <p class="text-muted">
                Crypto data: CoinGecko &amp; CryptoCompare. Stock data: Yahoo Finance (public endpoint).
            </p>
        </div>
    `);
};
