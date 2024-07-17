// import { useState } from 'react'
import './ComponentTwo.jsx'
// import './App.css'
import FlipCard from './ComponentTwo.jsx'

const flipCards =  [
  {"backTitle": "cpu", "backText": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi saepe illum similique quisquam quo quis tempore quia suscipit quae minus.", "front" : "/public/Images/cpu.png"},
  {"backTitle": "hard drive","backText": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi saepe illum similique quisquam quo quis tempore quia suscipit quae minus.", "front" : "/public/Images/hard-drive.png"},
  {"backTitle": "memory","backText": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi saepe illum similique quisquam quo quis tempore quia suscipit quae minus.", "front" : "/public/Images/memory-card.png"},
  {"backTitle": "motherboard","backText": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi saepe illum similique quisquam quo quis tempore quia suscipit quae minus.", "front" : "/public/Images/motherboard.png"},
]


function CardFlipApp() {



  return (
    <>
    <h1>Click on a card to learn more about the hardware!</h1>
    <div className="card-grid">
      
      {flipCards.map((cardInfo, index) => (
        <FlipCard key={index} backTitle={cardInfo.backTitle} backText={cardInfo.backText} front={cardInfo.front} />
      ))}
    </div>
      
    </>
  )
}

export default CardFlipApp;
