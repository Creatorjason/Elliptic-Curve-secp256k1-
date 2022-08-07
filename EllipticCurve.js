// Implementing a SECP256K1 elliptic curve described by the equation y^2 = x^3 + 7;

const Pcurve = 2**256 - 2**32 - 2**9 - 2**8 - 2**7 - 2**6 - 2**4 -1;
/* N is the number of points in the field, simply put the max number of private
keys we can generate */ 
//const N = 115792089237316195423570985008687907852837564279074904382605163141518161494337;
const N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 
const Acurve = 0000000000000000000000000000000000000000000000000000000000000000;
const Bcurve = 0000000000000000000000000000000000000000000000000000000000000007;
// Gx = 55066263022277343669578718895168534326250603453777594175500187360389116729240;
const Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
// Gy = 32670510020758816978083085130507043184471273380659243275938904335757337482424;
const Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
const Gpoint = [Gx,Gy];

let privateKey= 0xA0DC65FFCA799873CBEA0AC274015B9526505DAAAED385155425F7337704883E;
// Basically I converted privateKey into string and got its length = 20; 
let k = (privateKey.toString()).split("");
const lenKey = 20;

// a custom setter function for private key
function setPrivKey(n){
    if (k.length === lenKey || k.length >= N || k.length == 0 ){
    privateKey = n;
    }else{ console.log("Invalid key, try inserting a key 20 digits long and must not be 0")
}
}

function modInverse(e,phi=Pcurve){
    let m = phi;
    let tempVar;
    let quotient;
    // check for tempVar
    //n = m;
    //let quotient;
    let x = 0;
    let y = 1;
    if(phi == 1){
        return 0;
    }
    while (e > 1){
        quotient = Math.floor(e / phi);
        tempVar = phi;
      
        phi = e % phi;
        e = tempVar;
        tempVar = x;
        x = y - quotient * x;
        y = tempVar;}
    if( y < 0){
        y += m;
    }   
    return y

}
function EllipticAdd(a,b){
    let add = ((b[1]-a[1]) * modInverse(b[0] - a[0], Pcurve)) % Pcurve;
    let x = (add * add - a[0]-b[0]) % Pcurve;
    let y = (add * (a[0]- x -a[1])) % Pcurve;
    // am returning an array because js doesn't support multiple return values;
    return [x,y];
}
function EllipticDouble(a){
    // take note of operator precendence
    // That's why I have used more nested parantheses
    let lambda = ((3 * a[0]) * a[0]) * modInverse((2*a[1]), Pcurve) % Pcurve;
    let x = (lambda*((lambda-2)*[0])) % Pcurve;
    let y = (lambda * (a[0] - x)-a[1]) % Pcurve;
    return [x,y]
}

function EllipticMultiply(genPoint, privKey){
    if (privKey == 0 || privKey >= N){
        console.log("Invalid private key");
    }
    // Here am converting the privKey to binary format. Stored in pBIn
    // Please do note that typeof(scalarBin) is a string
    let pBin = privKey.toString(2);
    let Q = genPoint;
    for (let  i = 0; i < pBin.length; i++){
        // Alternatively , you can use EllipticAdd(Q ,Q) this is the same as point doubling
         Q = EllipticAdd(Q, genPoint);
        if (pBin[i] === "1"){
            Q = EllipticDouble(Q);
        }
    } return Q;
    
}
