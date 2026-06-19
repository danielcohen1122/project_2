// Stock market view for Cryptonite.
// Pulls live quotes from Yahoo Finance's public endpoint (no API key needed),
// the same keyless approach the crypto side uses. If the request is blocked
// (CORS / offline), it falls back to a public CORS proxy, and finally to
// generated demo data so the page always shows something.

const STOCK_SYMBOLS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'AMD', name: 'Advanced Micro Devices' },
    { symbol: 'INTC', name: 'Intel Corp.' },
    { symbol: 'DIS', name: 'The Walt Disney Co.' },
    { symbol: 'KO', name: 'The Coca-Cola Co.' },
];

const STOCK_CACHE_MS = 1000 * 60 * 2; // keep a quote fresh for 2 minutes

const buildYahooUrl = (symbol) =>
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

// Try the endpoint directly, then through a CORS proxy if the browser blocks it.
const fetchJsonWithFallback = async (url) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        // direct call failed (usually CORS) — fall through to the proxy
    }

    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
    const proxyResponse = await fetch(proxyUrl);
    return await proxyResponse.json();
};

// Deterministic-ish demo quote so the card always renders nicely offline.
const makeMockQuote = (symbol) => {
    const base = 40 + (symbol.charCodeAt(0) % 60) * 5;
    const changePct = (Math.random() * 8) - 4; // -4%..+4%
    const price = base * (1 + changePct / 100);
    return {
        price: price,
        prevClose: base,
        changePct: changePct,
        currency: 'USD',
        isMock: true,
    };
};

const getStockQuote = async (symbol) => {
    // serve a fresh cached value if we have one
    const cached = localStorage.getItem('stock-' + symbol);
    if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() < data.timeOfSave + STOCK_CACHE_MS) {
            return data.quote;
        }
    }

    let quote;
    try {
        const json = await fetchJsonWithFallback(buildYahooUrl(symbol));
        const meta = json.chart.result[0].meta;
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose || price;
        quote = {
            price: price,
            prevClose: prevClose,
            changePct: prevClose ? ((price - prevClose) / prevClose) * 100 : 0,
            currency: meta.currency || 'USD',
            isMock: false,
        };
    } catch (e) {
        console.log('stock fetch failed for ' + symbol + ', using demo data', e);
        quote = makeMockQuote(symbol);
    }

    localStorage.setItem('stock-' + symbol, JSON.stringify({ quote, timeOfSave: Date.now() }));
    return quote;
};

const renderStockCard = (stock, quote) => {
    const isUp = quote.changePct >= 0;
    const trendClass = isUp ? 'trend-up' : 'trend-down';
    const arrow = isUp ? '▲' : '▼';
    const demoBadge = quote.isMock ? '<span class="demo-badge" title="Live data unavailable — showing demo">demo</span>' : '';

    return `
    <div class="card stock-card">
        <div class="card-body">
            <h5 class="card-title">${stock.symbol} ${demoBadge}</h5>
            <p class="card-text stock-name">${stock.name}</p>
            <div class="stock-price">$${quote.price.toFixed(2)}</div>
            <div class="stock-change ${trendClass}">
                ${arrow} ${Math.abs(quote.changePct).toFixed(2)}%
            </div>
        </div>
    </div>`;
};

const loadStocks = async () => {
    setActiveNav('Stocks');
    $('#container').html('<div class="info-msg">Loading stock market data…</div>');
    showProgress();

    const cards = await Promise.all(STOCK_SYMBOLS.map(async (stock) => {
        const quote = await getStockQuote(stock.symbol);
        return renderStockCard(stock, quote);
    }));

    $('#container').html(cards.join(''));
    hideProgress();
};
