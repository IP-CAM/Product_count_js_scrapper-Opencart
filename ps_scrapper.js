var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://code.jquery.com/jquery-3.5.1.min.js";
$("head").append(s);

setTimeout(function () {

	let atags = []
	let total_count = 0  
	let datas = []
	// const pagesToGet = [1,2,3,4,5,6,7]
	const pagesToGet = [1,2,3,4,5]

	async function getURLS(i) {
	  await $.get('https://addons.prestashop.com/en/2-modules-prestashop?nb_item=96&page=' + i, function(html, status){
	     atags.push($(html).find('#products-list > div a'))
	  })
	}

	async function myfunc() {
	  let data = []
	  for(y=0; y< atags.length; y++) {
		  for(i=0; i< atags[y].length; i++) {
		    let url = atags[y][i].getAttribute('href')
		  	console.log(url)
		    await $.get(url, function(html, status){
		    	let nchild = 7
		    	let str = $(html).find('.specs-table .spec-line:nth-child(7) .primary-text.small-text.text').text()
		    	if($(html).find('[itemprop="offers"] .free-text').text() == 'Free' || str.indexOf('Number') != 0) {
		    		nchild = 6
		    	}
		    	console.log(str, nchild)
		    	
		    	let tdata = {
		          'sale_count': getcount($(html).find('.specs-table .spec-line:nth-child(' + nchild + ') .spec-data').text().trim()),
		          'price': $(html).find('[itemprop="price"]').attr('content'),
		          'name': trimspace($(html).find('#product_title').text().trim()),
		        }

		  		console.log(tdata)
		       datas.push(tdata)
		       total_count += parseInt(tdata.sale_count)
		    })
		  }
	  }
	}

	const mapLoop = async _ => {
	  console.log('Start')

	  const promises = pagesToGet.map(async page => {
	    const result = await getURLS(page)
	    return result
	  })


	  const allresults = await Promise.all(promises)
	  await myfunc()

	  console.table(datas)
	  console.log('total_count : ', total_count)
	  console.log('End')
	}

	function trimspace(str) {
		str = str.replace(/\s\s+/g, ' ', str)
		return str.replace(/  +/g, ' ', str)
	}

	function getcount(str) {
		str = str.replace(/en+|fr+|es+|it+|de+|ru+|cs+|nl+|pl+|tr+|pt+|zh+/g, '', str)
		str = str.replace(/\s\s+/g, '', str)
		str = str.replace(/  +/g, '', str)
		return str.replace(/,/g, '', str)
	}

	mapLoop()
}, 2000)
