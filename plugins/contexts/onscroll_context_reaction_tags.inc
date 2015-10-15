<?php

/**
 * @file
 * Context reaction plugin for onscroll ads.
 */

/**
 * Expose onscroll tags as context reactions.
 */
class onscroll_context_reaction_tags extends context_reaction {
  /**
   * Allow admins to choose what onscroll tags to hide.
   */
  function options_form($context) {
    // Get existing values for this form.
    $values = $this->fetch_from_context($context);

    // Get a list of all DART tags.
    $options = array();
    $tags = onscroll_tag_load_all();
    foreach ($tags as $tag) {
      $options[$tag->machinename] = $tag->slot;
    }

    $form = array(
      '#title' => t('Hide these onscroll tags'),
      '#description' => t('The following onscroll tags will not be displayed.'),
      '#type' => 'checkboxes',
      '#options' => $options,
      '#default_value' => isset($values) ? $values : array(),
    );

    return $form;
  }

  /**
   * Disable any tags that should be disabled based on context.
   */
  function execute(&$tag) {
    // Check each currently set context to see if the DART tag specified by
    // machinename should be displayed or not.
    foreach ($this->get_contexts() as $context_name => $context) {
      if (isset($context->reactions['onscroll_tags']) && in_array($tag->machinename, $context->reactions['onscroll_tags'], TRUE)) {
        $tag->disabled = TRUE;
        break;
      }
    }
  }
}
