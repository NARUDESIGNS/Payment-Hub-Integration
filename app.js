const buySonyBtn = document.getElementById('buy-sony');
const buyAppleBtn = document.getElementById('buy-apple');
const payBtn = document.getElementById('pay-btn');
const payText = document.getElementById('pay-text');
const loader = document.getElementById('loader');

const sonyPrice = document.getElementById('sony-price');
const applePrice = document.getElementById('apple-price');
const price = document.getElementById('price');

const cardNumber = document.getElementById('card-number');
const expDate = document.getElementById('exp-date');
const cvv = document.getElementById('cvv');

  function show(el, style) {
    el.style.display = style;
  }

  function hide(el) {
    el.style.display = 'none';
  }

  // GET TAC
  function getTAC(price) {
    const body = {
      "MAC": "2ifP9bBSu9TNXTsdgD7By451AR35sfus",
      "AMOUNT": price,
      "TRAN_NBR": "0010",
      "TRAN_GROUP": "AUTH",
      "REDIRECT_URL": "https://payment-hub-integration.netlify.app/completed"
    };
    
    fetch("https://keyexch.epxuap.com/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(body),
      redirect: 'follow'
    })
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, 'text/xml');
      const TAC = xml.getElementsByTagName('FIELD')[0].textContent;
      getBRIC(TAC, price);
      console.log(TAC);
    })
    .catch(error => {
      alert(error);
      hide(loader);
      show(payText, 'inline-block');
    });
  }


  // GET AUTH_GUID (BRIC)
  function getBRIC(TAC, price) {
    const body = {
        "TAC": TAC,
        "TRAN_CODE": "AUTH",
        "CUST_NBR": 9001,
        "MERCH_NBR": 711001,
        "DBA_NBR": 1,
        "TERMINAL_NBR": 15,
        "AMOUNT": price,
        "INDUSTRY_TYPE": "E",
        "ACCOUNT_NBR": cardNumber.value,
        "CVV2": cvv.value,
        "EXP_DATE": expDate.value.replace('/', ''),
        "REDIRECT_URL": "https://payment-hub-integration.netlify.app/completed"
    };

    fetch("https://services.epxuap.com/browserpost/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(body),
        redirect: 'follow'
    })
    .then(response => response.text())
    .then(xmlString => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'text/xml');
        // const toekn = xml.querySelector('input[name="AUTH_GUID"]').value;
        // makePayment(toekn, price) // make payment using the Custom Pay API
        console.log(xml);
    })
    .catch(error => alert(error))
    .finally(() => {
      hide(loader);
      show(payText, 'inline-block');
    });
  }

  // Make Payment
  function makePayment(BRIC, price) {
    const body = {
      "amount": price,
      "batchID": 123,
      "transaction": 123,
      "industryType": "E",
      "cardEntryMethod": "Z"
    }

    fetch(`https://epi.epxuap.com/sale/${BRIC}/capture`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'EPI-Id': '9001-711001-1-15',
        'EPI-Key': '8EEDC66DF02D7803E05321281FAC8C31',
        'EPI-Signature': 'xxx', // hmac signature here...
        'EPI-BRIC': `${BRIC}`,
        'EPI-Trace': '123'
      },
      body: JSON.stringify(body),
      redirect: 'follow'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      alert(error);
    })
  }


  buySonyBtn.addEventListener('click', () => {
    price.innerText = sonyPrice.innerText;
  });

  buyAppleBtn.addEventListener('click', () => {
    price.innerText = applePrice.innerText;
  });

  expDate.addEventListener('input', (e) => {
    const inputData = e.target;
    if (inputData.value.length === 2 && !inputData.value.includes('/')) {
      inputData.value = inputData.value.slice(0,2) + '/';
      console.log(e.target.value);
    }
  });

  payBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hide(payText);
    show(loader, 'inline-block');
    if (!cardNumber.value || !expDate.value || !cvv.value) alert('Please fill all fields!');
    else getTAC(price.innerText);
  });