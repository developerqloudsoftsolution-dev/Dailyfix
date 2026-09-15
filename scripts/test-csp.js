async function checkCSP() {
  try {
    const res = await fetch('http://localhost:5000/');
    const csp = res.headers.get('content-security-policy');
    console.log('Server Status:', res.status);
    console.log('CSP Header:', csp ? csp : 'NONE');
  } catch (err) {
    console.error('Check failed:', err.message);
  }
}

checkCSP();
