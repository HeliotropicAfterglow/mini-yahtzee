import React, { useEffect, useState } from 'react'
import { Text, View, Pressable } from 'react-native'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import styles from '../style/style'

let board = []
const NBR_OF_DICES = 5
const NBR_OF_THROWS = 3
const WINNING_POINTS = 63

export default function Gameboard() {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
  const [dices, setDices] = useState([0, 0, 0, 0, 0])
  const [status, setStatus] = useState('')
  const [pointSums, setPointSums] = useState([0, 0, 0, 0, 0, 0])
  const [selectedPoints, setSelectedPoints] = useState([false, false, false, false, false, false])
  const [selectedDices, setSelectedDices] = useState([false, false, false, false, false])
  const [score, setScore] = useState(0)
  const [canSelectPoints, setCanSelectPoints] = useState(true)
  const [canSelectDices, setCanSelectDices] = useState(true)
  const [showDices, setShowDices] = useState(true)
  const [buttonCaption, setButtonCaption] = useState('Throw dices')

  function throwDices() {
    if (checkGameOver()) {
      for (let i = 0; i < 6; i++) {        
        pointSums[i] = 0
        selectedPoints[i] = false
      }
      for (let i = 0; i < 5; i++) {
        selectedDices[i] = false
      }
      setStatus('Throw dices')
      setShowDices(true)
      setButtonCaption('Throw dices')
      setScore(0)
      setCanSelectPoints(true)
      setCanSelectDices(true)
      setNbrOfThrowsLeft(2)
      return
    }
    if (nbrOfThrowsLeft === 0) {
      setStatus('You should select points first')
      return
    }
    setShowDices(true)
    setStatus('Throw dices')
    if (nbrOfThrowsLeft === 3) {
      setCanSelectPoints(true)            
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1)
    for (let i = 0; i < 6; i++) {        
      if (!selectedPoints[i]) {
        pointSums[i] = 0
      }
    }

    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1)
        board[i] = 'dice-' + randomNumber
        dices[i] = randomNumber   
      }
    }

    for (let i = 0; i < 6; i++) {
      if (!selectedPoints[i]) {
        for (let j = 0; j < 5; j++) {
          if (dices[j] === (i + 1))
          pointSums[i] += dices[j]
        }
      }      
    }
  }

  function checkGameOver() {
    function checkPointsSelected(points) {
      return points === true;
    }

    if (selectedPoints.every(checkPointsSelected)) {
      setStatus('Game over. All points selected') 
      setShowDices(false)
      setButtonCaption('New game')
      return true
    } else {
      return false
    }       
  }

  function selectPoint(diceNumber) {
    if (nbrOfThrowsLeft === 0 && canSelectPoints) {   
      if (selectedPoints[diceNumber]) {
        return
      }   
      setSelectedPoints(prevSelectedPoints => {
        return [
            ...prevSelectedPoints.slice(0, diceNumber),
            prevSelectedPoints[diceNumber] = true,
            ...prevSelectedPoints.slice(diceNumber + 1),
        ]        
      })

      for (let i = 0; i < 5; i++) {
        selectedDices[i] = false
      }
      setScore(0)
      let sum = 0
      for (let i = 0; i < 6; i++) {        
        if (selectedPoints[i]) {
          sum += pointSums[i]
        }
      }      
      setScore(sum)
      if (checkGameOver()) {
        return
      }
      setShowDices(false)
      setCanSelectPoints(false)
      setCanSelectDices(true)      
      setNbrOfThrowsLeft(NBR_OF_THROWS)
      setStatus('Throw dices')
    } else {
      setStatus('You have to throw dices first.')
    }
  }

  function selectDice(diceNumber) {
    if (canSelectDices) {
      setSelectedDices(prevSelectedDices => {
        return [
          ...prevSelectedDices.slice(0, diceNumber),
          prevSelectedDices[diceNumber] = !prevSelectedDices[diceNumber],
          ...prevSelectedDices.slice(diceNumber + 1),
        ]
      })
    }    
  }

  useEffect(() => {
    if (nbrOfThrowsLeft === 0) {
      setStatus('Select your points')
      setCanSelectDices(false)
    }
    
  }, [nbrOfThrowsLeft])  

  const row = []
  for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
      <Pressable onPress={() => selectDice(i)} key={"row" + i}>
        <MaterialCommunityIcons 
          name={board[i]}
          size={50}
          color={selectedDices[i] ? "black" : "steelblue"}>
        </MaterialCommunityIcons>
      </Pressable>
    )
  }

  const points = []
  for (let i = 1; i < 7; i++) {
    points.push(
      <View key={"numeric-" + i + "-circle"}>
        <Pressable onPress={() => selectPoint(i - 1)}> 
          <MaterialCommunityIcons 
            name={"numeric-" + i + "-circle"}          
            size={50}
            color={selectedPoints[i - 1] ? "black" : "steelblue"}>
          </MaterialCommunityIcons>
        </Pressable>
        <Text style={{textAlign: 'center'}}>{pointSums[i - 1]}</Text>
      </View>
    )
  }

  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{showDices ? row : null}</View>
      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <Pressable style={styles.button}
        onPress={() => throwDices()}>
        <Text style={styles.buttonText}>{buttonCaption}</Text>
      </Pressable>
      <Text style={{fontSize: 28}}>Total: {score}</Text>
      <Text>{score >= WINNING_POINTS ? "You got the bonus!" : "You are " + (WINNING_POINTS-score) + " points away from bonus"}</Text>
      <View style={styles.flex}>{points}</View>
    </View>
  )
}
