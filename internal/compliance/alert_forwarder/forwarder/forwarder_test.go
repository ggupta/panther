package forwarder

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

import (
	"errors"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/aws/aws-sdk-go/service/sqs/sqsiface"
	jsoniter "github.com/json-iterator/go"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"

	"github.com/panther-labs/panther/internal/core/alert_delivery/models"
)

type mockSqsClient struct {
	sqsiface.SQSAPI
	mock.Mock
}

func (m *mockSqsClient) SendMessage(input *sqs.SendMessageInput) (*sqs.SendMessageOutput, error) {
	args := m.Called(input)
	return args.Get(0).(*sqs.SendMessageOutput), args.Error(1)
}

func init() {
	alertQueueURL = "alertQueueURL"
}

func TestHandleAlert(t *testing.T) {
	mockSqsClient := &mockSqsClient{}
	sqsClient = mockSqsClient

	input := &models.Alert{
		PolicyID: aws.String("policyId"),
	}

	expectedMsgBody, err := jsoniter.MarshalToString(input)
	require.NoError(t, err)
	expectedInput := &sqs.SendMessageInput{
		QueueUrl:    aws.String("alertQueueURL"),
		MessageBody: aws.String(expectedMsgBody),
	}

	mockSqsClient.On("SendMessage", expectedInput).Return(&sqs.SendMessageOutput{}, nil)
	require.NoError(t, Handle(input))
	mockSqsClient.AssertExpectations(t)
}

func TestHandleAlertSqsError(t *testing.T) {
	mockSqsClient := &mockSqsClient{}
	sqsClient = mockSqsClient

	input := &models.Alert{
		PolicyID: aws.String("policyId"),
	}

	mockSqsClient.On("SendMessage", mock.Anything).Return(&sqs.SendMessageOutput{}, errors.New("error"))
	require.Error(t, Handle(input))
	mockSqsClient.AssertExpectations(t)
}
