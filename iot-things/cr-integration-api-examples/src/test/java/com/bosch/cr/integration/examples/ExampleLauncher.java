/*
 *                                            Bosch SI Example Code License
 *                                              Version 1.0, January 2016
 *
 * Copyright 2016 Bosch Software Innovations GmbH ("Bosch SI"). All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 * following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * BOSCH SI PROVIDES THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO
 * THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
 * ALL NECESSARY SERVICING, REPAIR OR CORRECTION. THIS SHALL NOT APPLY TO MATERIAL DEFECTS AND DEFECTS OF TITLE WHICH
 * BOSCH SI HAS FRAUDULENTLY CONCEALED. APART FROM THE CASES STIPULATED ABOVE, BOSCH SI SHALL BE LIABLE WITHOUT
 * LIMITATION FOR INTENT OR GROSS NEGLIGENCE, FOR INJURIES TO LIFE, BODY OR HEALTH AND ACCORDING TO THE PROVISIONS OF
 * THE GERMAN PRODUCT LIABILITY ACT (PRODUKTHAFTUNGSGESETZ). THE SCOPE OF A GUARANTEE GRANTED BY BOSCH SI SHALL REMAIN
 * UNAFFECTED BY LIMITATIONS OF LIABILITY. IN ALL OTHER CASES, LIABILITY OF BOSCH SI IS EXCLUDED. THESE LIMITATIONS OF
 * LIABILITY ALSO APPLY IN REGARD TO THE FAULT OF VICARIOUS AGENTS OF BOSCH SI AND THE PERSONAL LIABILITY OF BOSCH SI'S
 * EMPLOYEES, REPRESENTATIVES AND ORGANS.
 */
package com.bosch.cr.integration.examples;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

/**
 * Very simple main class which can launch the examples to try them out.
 */
public class ExampleLauncher
{
   public static void main(final String... args) throws InterruptedException, ExecutionException, TimeoutException
   {
//      final ManageThings manageThings = new ManageThings();
//      try
//      {
//         // manageThings.createReadUpdateDelete();
//         // manageThings.createAComplexThing();
//         // manageThings.retrieveThings();
//         manageThings.updateThing();
//      }
//      catch (InterruptedException | ExecutionException | TimeoutException e)
//      {
//         e.printStackTrace();
//      }

      final RegisterForChanges registerForChanges = new RegisterForChanges();
      registerForChanges.registerForAttributeChanges();
      registerForChanges.registerForThingChanges();
      registerForChanges.registerForThingChangesWithDeregistration();

      // final RegisterForAndSendMessages registerForAndSendMessages = new RegisterForAndSendMessages();
      // registerForAndSendMessages.registerForMessages();
      // registerForAndSendMessages.sendMessages();

      // final ManageFeatures manageFeatures = new ManageFeatures();
      // manageFeatures.crudFeature();
      // manageFeatures.crudFeatureProperty();
      // manageFeatures.crudFeatureProperties();


      // final RegisterForClaimMessages registerForClaimMessages = RegisterForClaimMessages.newInstance();
      // registerForClaimMessages.registerForClaimMessagesToSingleThing();
   }
}
