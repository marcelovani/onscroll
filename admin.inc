<?php

/**
 * @file
 * Contains the administrative functions of the OnScroll module.
 */

/**
 * Implements hook_admin_settings_form().
 * Used to create the admin form to configure the Meetrics.
 */
function onscroll_admin_settings_form() {
  $form = array();

  $form['onscroll_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('OnScroll Enabled'),
    '#default_value' => variable_get('onscroll_enabled', FALSE),
  );

  $form['onscroll_mode'] = array(
    '#type' => 'select',
    '#title' => t('Mode'),
    '#options' => array(
      'basic' => t('Basic'),
      'sticky' => t('Sticky'),
      'sticky_reappearing' => t('Sticky Reappearing'),
      'sticky_dual' => t('Sticky Dual'),
    ),
    '#default_value' => variable_get('onscroll_mode', 'basic'),
  );

  $form['onscroll_margin'] = array(
    '#type' => 'textfield',
    '#title' => t('Margin'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_margin', '605'),
  );

  $form['onscroll_margin_top'] = array(
    '#type' => 'textfield',
    '#title' => t('Top margin'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_margin_top', '10'),
  );

  $form['onscroll_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_height', '600'),
  );

  $form['onscroll_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_width', '300'),
  );

  $form['onscroll_interval'] = array(
    '#type' => 'textfield',
    '#title' => t('Interval'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_interval', '30'),
  );

  return system_settings_form($form);
}
