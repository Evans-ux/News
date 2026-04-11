"use client"

import styles from "./loader.module.css"

export default function Cardload(){
  return( 
  <div style={ 
    {margin: "0",
      padding: "0",
      boxSizing:"border-box"
}}>
    <div className={styles.body}>
      <div className={styles.card}>
      <h2>card</h2>
      </div>
    </div>
  </div>)
}