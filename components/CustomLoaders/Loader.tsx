 import React from 'react'
 import styles from  "./loader.module.css"
 
 const Loader = () => {
   return (
     <div style={{
        margin: "0",
        padding: "0",
        boxSizing: 'border-box'
     }}>
        <div className={styles.body}  >
               Loading...
            <div className={styles.loading}>
         
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
          
     </div>
   )
 }
 
 export default Loader