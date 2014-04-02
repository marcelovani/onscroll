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

  $form['global'] = array(
    '#type' => 'fieldset',
    '#title' => t('Global Settings'),
  );

  $form['global']['onscroll_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('OnScroll Enabled'),
    '#default_value' => variable_get('onscroll_enabled', FALSE),
  );

  $form['global']['onscroll_url'] = array(
    '#type' => 'textfield',
    '#title' => t('OnScroll URL'),
    '#default_value' => variable_get('onscroll_url', ONSCROLL_URL),
  );

  $form['global']['onscroll_code'] = array(
    '#type' => 'textarea',
    '#title' => t('OnScroll Code'),
    '#description' => t('The 64bit code provided by OnScroll'),
    '#default_value' => variable_get('onscroll_code', ONSCROLL_CODE),
  );

  $form['global']['onscroll_campaign_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Campaign Id'),
    '#size' => '25',
    '#default_value' => variable_get('onscroll_campaign_id', ''),
  );

  $form['global']['onscroll_creative_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Creative Id'),
    '#size' => '25',
    '#default_value' => variable_get('onscroll_creative_id', ''),
  );

  $form['global']['onscroll_account_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Account Id'),
    '#size' => '25',
    '#default_value' => variable_get('onscroll_account_id', ''),
  );

  $form['options'] = array(
    '#type' => 'fieldset',
    '#title' => t('OnScroll Options'),
  );

  $form['options']['onscroll_mode'] = array(
    '#type' => 'select',
    '#title' => t('Mode'),
    '#options' => array(
      'basic' => t('Basic'),
      'sticky' => t('Sticky'),
      'sticky_reappearing' => t('Sticky Reappearing'),
      'sticky_dual' => t('Sticky Dual'),
    ),
    '#default_value' => variable_get('onscroll_mode', 'sticky'),
  );

  $form['options']['onscroll_interval'] = array(
    '#type' => 'textfield',
    '#title' => t('Interval'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_interval', '30'),
  );

  $form['options']['onscroll_reload'] = array(
    '#type' => 'checkbox',
    '#title' => t('Reload'),
    '#default_value' => variable_get('onscroll_reload', FALSE),
  );

  $form['dimensions'] = array(
    '#type' => 'fieldset',
    '#title' => t('Dimensions'),
  );

  $form['dimensions']['onscroll_margin'] = array(
    '#type' => 'textfield',
    '#title' => t('Margin'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_margin', '605'),
  );

  $form['dimensions']['onscroll_margin_top'] = array(
    '#type' => 'textfield',
    '#title' => t('Top margin'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_margin_top', '10'),
  );

  $form['dimensions']['onscroll_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_height', '600'),
  );

  $form['dimensions']['onscroll_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => variable_get('onscroll_width', '300'),
  );

  return system_settings_form($form);
}
