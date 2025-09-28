/*
*********************************************************************
// CATEGORIES ENDPOINT - KUHAON NATO TANAN QUESTION CATEGORIES DIRI
// Important ni para ma group2x ang mga questions sa interview
// Ma sort ni sila base sa sort_order para organized
*********************************************************************
*/




import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db.js'
export async function GET() {
  try {
    //*******************************************************************
    // QUERY SA DATABASE - KUHAON TANAN ACTIVE CATEGORIES
    // Importante ang sort_order para organized ang display
    // Inactive categories dili na ipakita
    //*******************************************************************
    const categories = await query(
      `SELECT id, name, description, icon, color, sort_order
       FROM question_categories 
       WHERE is_active = true 
       ORDER BY sort_order ASC`
    )

    return NextResponse.json({ categories })


  } catch (error) {
    //*******************************************************************
    // ERROR HANDLING - KUNG NAAY PROBLEMA SA DATABASE
    // I-log nato ang error para ma track kung unsa problema
    //*******************************************************************
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}