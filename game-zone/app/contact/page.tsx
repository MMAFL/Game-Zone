"use client"

import Footer from "../components/footer";
import Navbar from "../components/Navbar";


export default function Contact() {
    return (
        <div style={{ backgroundColor: "black", color: "white", fontFamily: "poppins, sans-serif", width: "100%" , overflowY: "hidden" }}>
            <Navbar />
            <div style={{ margin: "70px 0", backgroundColor: "black", color: "white", fontFamily: "poppins, sans-serif", width: "100%", overflow: "hidden" }}>
                <h1 style={{ fontSize: "40px" , display:"flex" , textAlign:"center" , justifyContent:"center" , alignItems:"center" , marginTop: "100px" }}>Contact Us</h1>
                <p style={{ fontSize: "20px", marginTop: "50px", color:"gray", display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
                    If you have any questions, please feel free to contact us at +216 12 345 312
                </p>
                <p style={{ fontSize: "20px", marginTop: "20px", color:"gray" , display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center", marginBottom: "150px" }}>
                    If you want to suggest adding a new game, please send an email to rbk@gmail.com
                </p>
                </div>
            <Footer />
        </div>
    );
}