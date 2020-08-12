var a = require.context('../public', true);
for(var k in a.keys())
    a(k);
