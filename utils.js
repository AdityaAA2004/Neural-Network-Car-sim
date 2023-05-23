function lerp(A,B,t){
    return A + (B - A)*t;
//this is famously written as (1-t)*A + B.
// The basic idea behind LERP is to find a value that lies somewhere between two known values based on a given interpolation factor.
// This factor, usually denoted by "t" or "alpha," typically ranges between 0 and 1,
// where 0 represents the first known value and 1 represents the second known value.
// Intermediate values are calculated by linearly interpolating between these two points.
}

function getIntersection(A,B,C,D){
    /*

    t and u are just arbitrary variables.
    Ix = Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
    Iy = Ay + (By - Ay)t = Cy + (Dy - Cy)u

    (Ax - Cx) + (Bx - Ax)t = (Dx - Cx)u
    (Ay - Cy) + (By - Ay)t = (Dy - Cy)[u * (Dx - Cx)]/(Dx - Cx)
    (Dx - Cx)(Ay - Cy) + (By - Ay)(Dx - Cx)t = (Ax - Cx)(Dy - Cy) + (Bx - Ax)(Dy - Cy)t

    t = [(Ax - Cx)(Dy - Cy) - (Dx - Cx)(Ay - Cy)]/[(By - Ay)(Dx - Cx) - (Bx - Ax)(Dy - Cy)]
     */
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x); // this is the numerator of the 't' expression.
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);//this is the numerator of the 'u' expression.
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y); // the denominator

    if (bottom !== 0){ // to avoid infinity
        const t = tTop/bottom; //the 't' variable is found.
        const u = uTop/bottom; // the 'u' variable is found.
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return {
                x: lerp(A.x,B.x,t), //get the x coordinate of the collision.
                y: lerp(A.y,B.y,t), // get y coordinate
                offset: t // how far off is the center of the car from collision.
            }
        }
    }
    return null;
}

function polysIntersect(poly1,poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }

        }
    }
    return false;
}

