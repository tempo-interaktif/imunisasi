var zoom = d3.zoom().scaleExtent([1,8]).on('zoom', zoomed);
function zoomed() {
    g_country.attr("transform", d3.event.transform);
}
var color =  ['#ffffff', '#ffd5ca', '#fbaa96', '#f07f64', '#e05135', '#cc0000']
var svg = d3.select("#map-world").append("svg").attr('x', 0).attr('y', 0).attr('viewBox', '0 0 960 500').attr('id', 'word-map').call(zoom).on("wheel.zoom", null);
var g_country = svg.append("g").attr("class", "countries")
var projection = d3.geoMercator().scale(600).translate([-750,350]);
var path = d3.geoPath().projection(projection);
var tooltip = d3.select('body').append('div').attr('class', 'hidden tooltip');
d3.select("#zoom_in").on("click", function() {
    zoom.scaleBy(svg.transition().duration(750), 1.2);
});
d3.select("#zoom_out").on("click", function() {
    zoom.scaleBy(svg.transition().duration(750), 0.8);
});
var provinsi = '';
d3.json("Asia.json",
  function(json) {
    country = g_country
    .selectAll("path")
    .data(json.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", "#e4e4e4")
    .style("opacity", '1')
    .attr("stroke", "#000000")
    .attr("stroke-width", 0.2)
    .attr("id",function(d){return d.properties.CODE;})
    .attr("class", "negara")
    .on("mouseover", function (d) {
        d3.select(this).transition().style("stroke-width", 1)
        loadTooltip(d),
        tooltip.style('visibility','visible').style("left", ((d3.event.pageX)+10) + "px").style("top", (d3.event.pageY - 28) + "px")
    })
    .on("mouseout", function (d) {
        d3.select(this).transition().style("stroke-width", 0.5)
        tooltip.style('visibility','hidden');
    });
    d3.csv('data.csv',function(csv){
	    provinsi = csv
        $.each(csv, function(id,v) {
            if (v.rangking == 5) {
                $('#'+v.code).css('fill',color[5])
            } else if (v.rangking == 4) {
                $('#'+v.code).css('fill',color[4])
            } else if (v.rangking == 3) {
                $('#'+v.code).css('fill',color[3])
            } else if (v.rangking == 2) {
                $('#'+v.code).css('fill',color[2])
            } else if (v.rangking == 1) {
                $('#'+v.code).css('fill',color[1])
            } else {
                $('#'+v.code).css('fill',color[0])
            }
        })
    })
    textCountry = g_country.selectAll("text").data(json.features).enter().append("svg:text").text(function(d){return d.properties.ADMIN;}).attr("x", function(d){return path.centroid(d)[0];}).attr("y", function(d){return  path.centroid(d)[1];}).attr("text-anchor","middle").attr('font-size','5pt').attr('class','textCountry');
  }
)
function readmore(e) {
    $(e).toggleClass('close');
    $('.box-inner, .more-btn').toggleClass('close');
}
function loadTooltip(d){
    var html = "";
    $.each(provinsi,function(id,value) {
        if (provinsi[id].code == d.properties.CODE) {
            html += `<div style="max-width:300px">
            <h4 class='kasus' style="padding-bottom:5px;font-size:15px">` + provinsi[id].country + `</h4>
            <p><b>Rangking : </b>` + provinsi[id].rangking + `</p>
            <p><b>Uang dihabiskan : </b> $` + provinsi[id].money + ` per kapita</p>
            <p><b>Angka kematian anak : </b>` + provinsi[id].death + `</p>
            <p><b>Jumlah tenaga medis : </b>` + provinsi[id].doctor + ` per 1000 orang</p>
            </div>`;
            tooltip.html(html);
        }else{
            html += ``;
            tooltip.html(html);
        }
    });
}