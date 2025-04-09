#ifndef MOTOR_H
#define MOTOR_H

#include "globals.h"

/* function to delay using TIMER2 in polling mode */
void delay(int microsec) {
    int ticks = microsec * 100;

    // set period in 32 bits
    timer2_ptr->startValLow = ticks & 0xFFFF;
    timer2_ptr->startValHigh = (ticks >> 16) & 0xFFFF;

    // start timer: CONT = 0; ITO = 0; START = 1;
    timer2_ptr->control = 0b0100;

    // wait for TO (timeout) bit to go high
    while (!(timer2_ptr->status & 0x01));

    // clear TO bit by writing
    timer2_ptr->status = 0x1;

    return;
}

/* pulse function for the servo */
void servo_pulse(int pulse_width) {
    // set GPIO high
    *pp_ptr = (0x4) | (*pp_ptr);

    // wit fo the pulse width duration 
    delay(pulse_width);

    // set GPIO low
    *pp_ptr = !(0b100 & *pp_ptr);

    // wit for reamining 20 ms
    delay(20000 - pulse_width);

    return;
}

#endif