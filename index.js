let atags = document.querySelectorAll('.extension-preview a')
let total_count = 0  
getURLS()

async function getURLS() {
  if(!atags.length) {  
    await $.get('https://www.opencart.com/index.php?route=marketplace/extension&filter_member=codeeshop', function(html, status){     
       atags = $(html).find('.extension-preview a')
    })
  }
  myfunc()
}

async function myfunc() {
  let data = []
  for(i=0; i< atags.length; i++) {
    let url = atags[i].getAttribute('href')
    await $.get(url, function(html, status){
       let tdata = {
          'count': $(html).find('#sales strong').text(),
          'name': $(html).find('.container h3').text(),
       }

       console.log('checking ' + tdata.name + ' : ' + tdata.count)
       data.push(tdata)
       total_count += parseInt(tdata.count)
    })
  }
  console.log(data, total_count);
}
