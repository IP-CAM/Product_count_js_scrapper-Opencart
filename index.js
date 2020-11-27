let atags = document.querySelectorAll('.extension-preview a')
let total_count = 0  
myfunc()

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