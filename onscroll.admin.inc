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

  // Make sure that all the necessary files are included even on ajax callbacks.
  form_load_include($form_state, 'inc', 'onscroll', 'plugins/export_ui/onscroll_tag_ctools_export_ui');

  $form['settings'] = array(
    '#type' => 'vertical_tabs',
  );


  $form['global'] = array(
    '#type' => 'fieldset',
    '#title' => t('Global Settings'),
  );

  $form['global']['onscroll_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('OnScroll Enabled'),
    '#default_value' => _onscroll_variable_get('onscroll_enabled'),
  );

  $form['global']['onscroll_url'] = array(
    '#type' => 'textfield',
    '#title' => t('OnScroll URL'),
    '#default_value' => _onscroll_variable_get('onscroll_url'),
  );

  $dfp_description = '';
  $options =  array('custom' => t('Custom'));
  if (module_exists('dfp')) {
    $dfp_description = ' ' . t('Or you can choose one of the DFP slots.');
    $tags = dfp_tag_load_all();
    foreach ($tags as $tag) {
      $options[$tag->machinename] = $tag->slot;
    }
  }
  $form['global']['onscroll_ad_slot'] = array(
    '#type' => 'select',
    '#title' => t('Ad slot'),
    '#options' => $options,
    '#default_value' => _onscroll_variable_get('onscroll_ad_slot'),
    '#description' => t('You can paste the Ad code here.') . $dfp_description,
  );

  $form['global']['onscroll_code'] = array(
    '#type' => 'textarea',
    '#title' => t('OnScroll Code'),
    '#description' => t('Paste the Ad code here.'),
    '#default_value' => _onscroll_variable_get('onscroll_code'),
    '#states' => array(
      'visible' => array('select[name="onscroll_ad_slot"]' => array('value' => 'custom')),
    ),
  );

  $form['global']['onscroll_campaign_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Campaign Id'),
    '#size' => '25',
    '#default_value' => _onscroll_variable_get('onscroll_campaign_id'),
  );

  $form['global']['onscroll_creative_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Creative Id'),
    '#size' => '25',
    '#default_value' => _onscroll_variable_get('onscroll_creative_id'),
  );

  $form['global']['onscroll_account_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Account Id'),
    '#size' => '25',
    '#default_value' => _onscroll_variable_get('onscroll_account_id'),
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
    '#default_value' => _onscroll_variable_get('onscroll_mode'),
  );

  $form['options']['onscroll_interval'] = array(
    '#type' => 'textfield',
    '#title' => t('Interval'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => _onscroll_variable_get('onscroll_interval'),
  );

  $form['options']['onscroll_reload'] = array(
    '#type' => 'checkbox',
    '#title' => t('Reload'),
    '#default_value' => _onscroll_variable_get('onscroll_reload'),
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
    '#default_value' => _onscroll_variable_get('onscroll_margin'),
  );

  $form['dimensions']['onscroll_margin_top'] = array(
    '#type' => 'textfield',
    '#title' => t('Top margin'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => _onscroll_variable_get('onscroll_margin_top'),
  );

  $form['dimensions']['onscroll_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => _onscroll_variable_get('onscroll_height'),
  );

  $form['dimensions']['onscroll_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => _onscroll_variable_get('onscroll_width'),
  );

  return system_settings_form($form);
}
/**
 * Returns the current breakpoints. The default value will be used unless an
 * "input" exists in the form_state variable, in which case that will be used.
 */
function _onscroll_breakpoints_get_existing($form_state, $default = array()) {
  $breakpoints = array();
  if (isset($form_state['input']['breakpoints'])) {
    $breakpoints = $form_state['input']['breakpoints'];
  }
  elseif (!empty($default)) {
    $breakpoints = $default;
  }

  return $breakpoints;
}



/**
 * Helper form builder for the targeting form.
 */
function _onscroll_targeting_form(&$targeting_form, $existing_targeting = array()) {
  // Display settings.
  $targeting_form['targeting'] = array(
    '#type' => 'markup',
    '#tree' => FALSE,
    '#prefix' => '<div id="dfp-targeting-wrapper">',
    '#suffix' => '</div>',
    '#theme' => 'onscroll__target_settings',
    '#element_validate' => array('onscroll__targeting_form_validate'),
  );

  // Add existing targets to the form unless they are empty.
  foreach ($existing_targeting as $key => $data) {
    _onscrolltarget_form($targeting_form, $key, $data);
  }
  // Add one blank set of target fields.
  _onscroll_target_form($targeting_form, count($existing_targeting));

  $targeting_form['targeting']['onscroll__more_targets'] = array(
    '#type' => 'submit',
    '#value' => t('Add another target'),
    '#submit' => array('onscroll__more_targets_submit'),
    '#limit_validation_errors' => array(),
    '#ajax' => array(
      'callback' => 'onscroll__more_targets_js',
      'wrapper' => 'onscroll_-targeting-wrapper',
      'effect' => 'fade',
      'file' => 'plugins/export_ui/onscroll__ctools_export_ui.inc',
    ),
  );
  $targeting_form['tokens'] = array(
    '#theme' => 'token_tree',
    '#token_types' => array('onscroll__tag', 'node', 'term', 'user'),
    '#global_types' => TRUE,
    '#click_insert' => TRUE,
    '#dialog' => TRUE,
  );
}

/**
 * Helper form builder for an individual target.
 */
function _onscroll_target_form(&$form, $key, $data = array()) {
  $form['targeting'][$key] = array(
    '#prefix' => '<div class="target" id="target-' . $key . '">',
    '#suffix' => '</div>',
    '#element_validate' => array('onscroll__target_form_validate'),
  );
  $form['targeting'][$key]['target'] = array(
    '#type' => 'textfield',
    '#title_display' => 'invisible',
    '#title' => t('Target Name'),
    '#size' => 10,
    '#default_value' => isset($data['target']) ? $data['target'] : '',
    '#parents' => array('targeting', $key, 'target'),
    '#attributes' => array('class' => array('field-target-target')),
  );
  $form['targeting'][$key]['value'] = array(
    '#type' => 'textfield',
    '#title_display' => 'invisible',
    '#title' => t('Target Value'),
    '#size' => 20,
    '#default_value' => isset($data['value']) ? $data['value'] : '',
    '#parents' => array('targeting', $key, 'value'),
    '#attributes' => array('class' => array('field-target-value')),
  );
  if (empty($data)) {
    $form['targeting'][$key]['target']['#description'] = t('Example: color');
    $form['targeting'][$key]['value']['#description'] = t('Example: red,white,blue');
  }
}


/**
 * Returns the current targets. The default value will be used unless an "input"
 * exists in the form_state variable, in which case that will be used.
 */
function _onscroll_targeting_get_existing($form_state, $default = array()) {
  $targeting = array();
  if (isset($form_state['input']['targeting'])) {
    $targeting = $form_state['input']['targeting'];
  }
  elseif (!empty($default)) {
    $targeting = $default;
  }

  return $targeting;
}