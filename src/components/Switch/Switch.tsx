import React, { FC, useState } from 'react'
import './style.scss'

type Props = {
  left: string
  right: string
  onChange: (t: any) => void
  checked?: string
  className?: string
}

const Switch: FC<Props> = (props) => {
  const { left, right, onChange, checked, className } = props
  const [currentSide, turnSwitch] = useState<string>(checked || left)

  const _onChange = (e: any) => {
    turnSwitch(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className={`switch switch--horizontal ${className}`}>
      <input
        id="on"
        type="radio"
        name="switch"
        value={left}
        onChange={_onChange}
        checked={currentSide === left}
      />
      <label htmlFor="on">{left}</label>
      <input
        id="off"
        type="radio"
        name="switch"
        value={right}
        onChange={_onChange}
        checked={currentSide === right}
      />
      <label htmlFor="off">{right}</label>
      <span className="toggle-outside">
        <span className="toggle-inside"></span>
      </span>
    </div>
  )
}

export default Switch
