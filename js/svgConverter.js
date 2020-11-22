function svgToPoints(svgString){
    function numberize(numString){return (parseInt(numString) - 32) / 64;}
    coord = []
    points = svgString.split(" ");
    for (var i = 0; i < points.length - 1; i+=2){
        coord.push(vec4.fromValues(numberize(points[i].slice(1)), 0, numberize(points[i+1]), 1));
    }
    coord.push(coord[0]);
    return coord;
}
//https://yqnn.github.io/svg-path-editor/