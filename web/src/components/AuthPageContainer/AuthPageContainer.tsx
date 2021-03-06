/**
 * Panther is a Cloud-Native SIEM for the Modern Security Team.
 * Copyright (C) 2020 Panther Labs Inc
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import { Flex, Box, Text, Heading, Label, SimpleGrid } from 'pouncejs';
import PantherLogoWhite from 'Assets/panther-icon--white.svg';

interface AuthPageContainerComposition {
  Caption: React.FC<{ title: string; subtitle?: string }>;
  AltOptions: React.FC;
}

interface AuthPageContainer {
  banner?: string;
}

const AuthPageContainer: React.FC<AuthPageContainer> & AuthPageContainerComposition = ({
  children,
  banner,
}) => {
  return (
    <SimpleGrid columns={3} height="100vh">
      <Box gridColumn="1/2" position="relative">
        <img
          src={banner}
          alt="Generic security illustrations"
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
        />
        <Flex
          position="absolute"
          top="0"
          left="0"
          align="center"
          py={150}
          width="100%"
          height="100%"
          direction="column"
        >
          <img src={PantherLogoWhite} alt="Panther Logo" width="54" height="54" />
          <Flex direction="column" align="center" justify="center" m="auto">
            <Label size="medium" mb={5} color="white" textAlign="center">
              Panther Community Edition
            </Label>
            <Heading size="medium" color="white" lineHeight="relaxed" textAlign="center">
              Detect threats with log data and improve cloud security posture
            </Heading>
            <Text size="large" color="white" mt={5} textAlign="center">
              Designed for any scale
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex gridColumn="2/4" justify="center" align="center">
        <Box width={460}>{children}</Box>
      </Flex>
    </SimpleGrid>
  );
};

/**
 * A compound component for the core caption of this auth page
 */
const AuthPageContainerCaption: AuthPageContainerComposition['Caption'] = ({ title, subtitle }) => (
  <Box mb={8}>
    <Heading as="h1" size="medium" color="grey400">
      {title}
    </Heading>
    {subtitle && (
      <Text as="p" size="large" color="grey200" mt={2}>
        {subtitle}
      </Text>
    )}
  </Box>
);

/**
 * A compounet component to act as a wrapper for any alternative options that the page can have
 */
const AuthPageContainerAlt: AuthPageContainerComposition['AltOptions'] = ({ children }) => (
  <Box position="absolute" right={10} top={10}>
    {children}
  </Box>
);

AuthPageContainer.Caption = AuthPageContainerCaption;
AuthPageContainer.AltOptions = AuthPageContainerAlt;

export default AuthPageContainer;
