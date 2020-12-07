var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js";
$("head").append(s);

var s = document.createElement("link");
s.type = "text/css";
s.rel = "stylesheet";
s.href = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css";
$("head").append(s);

setTimeout(function () {
  let atags = []
  let total_count = 0  
  let datas = []
  var pages = 1
  var pagesToGet = []

  for(let i = 0; i < pages; i++) {
    pagesToGet.push(i)
  }

  async function getURLS(i) {
    await $.get('https://www.opencart.com/index.php?route=marketplace/extension&filter_member=codeeshop&page=' + i, function(html, status){
       atags.push($(html).find('.extension-preview a'))
    })
  }

  async function myfunc() {
    let data = []
    for(y=0; y< atags.length; y++) {
      for(i=0; i< atags[y].length; i++) {
        let url = atags[y][i].getAttribute('href')
        // console.log(url)
        await $.get(url, function(html, status){
           let tdata = {
              'sale_count': $(html).find('#sales strong').text(),
              'name': $(html).find('.container h3').text(),
	      'comment': parseInt($(html).find('#comment strong').text()),
	      'price': $(html).find('#price .text-right').text(),   
           }

           datas.push(tdata)
           toastr["success"](tdata.sale_count + ' : '+ tdata.name)
           total_count += parseInt(tdata.sale_count)
        })
      }
    }
  }

  const mapLoop = async _ => {
    console.log('Start')

    const promises = pagesToGet.map(async page => {
      const numFruit = await getURLS(page)
      return numFruit
    })


    const numFruits = await Promise.all(promises)
    await myfunc()

    console.table(datas)
    console.log('total_count : ', total_count)
    toastr["success"]('total_count : ' + total_count)
    console.log('End')
  }

  mapLoop()  
}, 2000)
