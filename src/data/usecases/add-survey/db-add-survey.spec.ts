import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

const makeFakeAddSurveyModel = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

describe('DbAddSurvey', () => {
  it('Should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (data: AddSurveyModel): Promise<void> {
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    await sut.add(makeFakeAddSurveyModel())

    expect(addSpy).toHaveBeenCalledWith(makeFakeAddSurveyModel())
  })
})
