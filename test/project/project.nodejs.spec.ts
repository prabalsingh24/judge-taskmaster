import { execute } from '../../src/tasks/'
import { ProjectJob } from '../../src/tasks/jobs/project'

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {expect} = chai
chai.use(chaiAsPromised)

describe('project-nodejs', () => {
  it('should run nodejs project correctly', async () => {
    const projectResult = await execute(new ProjectJob({
      id: 26,
      source: 'https://minio.cb.lk/public/problem.zip',
      problem: 'https://minio.cb.lk/public/solution.zip',
      submissionDirs: 'src/*',
      lang: 'nodejs',
      timelimit: 20,
      scenario: 'project'
    }))

    expect(projectResult).to.have.keys(
        'id',
        'stderr',
        'stdout',
        'code',
        'time',
        'score'
    )
    expect(projectResult.code).to.equal(0)
    expect(projectResult.score).to.equal(100)
  })

  it('should return code = 25 when test directory is modified', async () => {
    // changing submissionDirs to mock that :P
    const projectResult = await execute(new ProjectJob({
      id: 23,
      source: 'https://minio.cb.lk/public/problem.zip',
      problem: 'https://minio.cb.lk/public/solution.zip',
      submissionDirs: 'test/*',
      lang: 'nodejs',
      timelimit: 20,
      scenario: 'project'
    }))
    expect(projectResult).to.have.keys(
        'id',
        'stderr',
        'stdout',
        'code',
        'time',
        'score'
    )
    expect(projectResult.code).to.equal(25)
    expect(projectResult.score).to.equal(0)
  })

  it('should throw error when url is invalid', async () => {
    const job = new ProjectJob({
      id: 25,
      source: 'https://www.invalidurl.com',
      problem: 'https://www.invalidurl.com',
      submissionDirs: 'src/*',
      lang: 'nodejs',
      timelimit: 20,
      scenario: 'project'
    })

    await expect(execute(job)).to.be.rejected;
  })

  it('should return code = 1 when there is a build error', async () => {
    // file downloaded from google.com will not be a nodejs project, hence build error
    const projectResult = await execute(new ProjectJob({
      id: 25,
      source: 'https://www.google.com',
      problem: 'https://www.google.com',
      submissionDirs: 'src/*',
      lang: 'nodejs',
      timelimit: 20,
      scenario: 'project'
    }))
    expect(projectResult).to.have.keys(
        'id',
        'stderr',
        'stdout',
        'code',
        'time',
        'score'
    )
    expect(projectResult.code).to.equal(1)
    expect(projectResult.score).to.equal(0)
  })
})